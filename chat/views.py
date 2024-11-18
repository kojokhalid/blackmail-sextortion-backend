from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view,permission_classes
from rest_framework import status
from .models import ChatMessage,ChatSession
from .serializers import ChatSessionSerializer,ProfileSerializer
# from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch
from rest_framework import status
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.middleware.csrf import get_token
from django.http import JsonResponse
import random
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from .models import OTP
from django.conf import settings
import jwt
from datetime import datetime, timedelta
from django.contrib.auth import authenticate, get_user_model
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.decorators import login_required# Load necessary models for each functionality
from django.views.decorators.http import require_POST
from .serializers import MyTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.views.decorators.csrf import csrf_exempt
# from .ai import get_intent, get_sentiment, get_entities, generate_response
@api_view(['GET'])
def get_routes(request):
    routes = ['/token','/token/refresh']
    return Response(routes)

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
@csrf_exempt
@permission_classes([IsAuthenticated])
def get_profile(request):
    user = request.user
    if not user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

    profile = user.profile
    serializer = ProfileSerializer(profile, many=False)
    return Response(serializer.data)
@csrf_exempt
def get_csrf_token(request):
    csrf_token = get_token(request)  # Get the CSRF token
    return JsonResponse({'csrfToken': csrf_token})
# Set pad_token to eos_token if it's not defined
# if response_tokenizer.pad_token is None:
#     response_tokenizer.pad_token = response_tokenizer.eos_token

class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()  # Save the user with Django's default User model

            # Generate OTP
            otp = generate_otp()

            # Encode OTP and user info in a JWT
            expiration = datetime.utcnow() + timedelta(minutes=10)
            payload = {
                'user_id': user.id,
                'otp': otp,
                'exp': expiration
            }
            otp_token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

            # Send OTP via email
            send_otp_email(user.email, otp)  

            # Return OTP token to the client
            return Response({
                "message": "Sign up successful. An OTP has been sent to your email.",
                "otp_token": otp_token  # Send OTP token for frontend to store
            }, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
def generate_otp():
    return str(random.randint(100000, 999999))

@require_POST
@login_required  # Ensures only authenticated users can create sessions
def start_chat_session(request):
    # Create a new ChatSession and save it to the database
    chat_session = ChatSession.objects.create(user=request.user)
    
    # Return the session ID as a JSON response
    return JsonResponse({'session_id': chat_session.id})

class BotResponseView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user_message = request.data.get('message')
        session_id = request.data.get('session_id')

        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve or create a ChatSession
        if session_id:
            try:
                chat_session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response({"error": "Invalid session ID"}, status=status.HTTP_404_NOT_FOUND)
        else:
            chat_session = ChatSession.objects.create(user=request.user)
            session_id = chat_session.id

        try:
            # # Use AI functions to process the user message
            # intent = get_intent(user_message)
            # sentiment = get_sentiment(user_message)
            # entities = get_entities(user_message)
            # generated_response = generate_response(user_message)  # Note: Use `generated_response` here
            generated_response = f"echoeing back your message:${user_message}"
            # Save the message and bot response to the database
            ChatMessage.objects.create(
                session=chat_session,
                user=request.user,
                user_message=user_message,
                bot_response=generated_response  # Save `generated_response` here
            )

            # Set the title for the chat session if this is the first message
            if not chat_session.title:
                chat_session.title = f"Chat started on {chat_session.created_at.strftime('%Y-%m-%d %H:%M')}"
                chat_session.save()

        except Exception as e:
            # Handle any exceptions that may occur during processing
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        # Return the response with session details
        return Response({
            "bot_response": generated_response,
            "session_id": str(session_id),
            "session_title": chat_session.title,
        }, status=status.HTTP_201_CREATED)


# Send OTP via email
def send_otp_email(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}. This code will expire in 10 minutes.'
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
class VerifyOTPView(APIView):
    def post(self, request):
        otp_token = request.data.get("otp_token")
        otp_input = request.data.get("otp")

        try:
            # Decode JWT
            payload = jwt.decode(otp_token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Verify OTP
            if payload['otp'] == otp_input:
                return Response({
                    "message": "OTP verified successfully!"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Invalid OTP. Please try again."
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except jwt.ExpiredSignatureError:
            return Response({
                "message": "OTP has expired. Please request a new one."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except jwt.InvalidTokenError:
            return Response({
                "message": "Invalid OTP token. Please try again."
            }, status=status.HTTP_400_BAD_REQUEST)
User = get_user_model()
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if a user with this email exists
        try:
            user_obj = User.objects.get(email=email)
            # Use the user's username for authentication
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        # If user authentication is successful
        if user:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)


def generate_otp():
    return get_random_string(length=6, allowed_chars='0123456789')

# Send OTP via email
def send_otp_email(email, otp):
    subject = 'Your OTP Code'
    message = f'Your OTP code is {otp}. This code will expire in 10 minutes.'
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
class VerifyOTPView(APIView):
    def post(self, request):
        otp_token = request.data.get("otp_token")
        otp_input = request.data.get("otp")

        try:
            # Decode JWT
            payload = jwt.decode(otp_token, settings.SECRET_KEY, algorithms=['HS256'])
            
            # Verify OTP
            if payload['otp'] == otp_input:
                return Response({
                    "message": "OTP verified successfully!"
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "message": "Invalid OTP. Please try again."
                }, status=status.HTTP_400_BAD_REQUEST)
        
        except jwt.ExpiredSignatureError:
            return Response({
                "message": "OTP has expired. Please request a new one."
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except jwt.InvalidTokenError:
            return Response({
                "message": "Invalid OTP token. Please try again."
            }, status=status.HTTP_400_BAD_REQUEST)
User = get_user_model()
class LoginView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Check if a user with this email exists
        try:
            user_obj = User.objects.get(email=email)
            # Use the user's username for authentication
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None

        # If user authentication is successful
        if user:
            refresh = RefreshToken.for_user(user)
            access_token = refresh.access_token

            return Response({
                'access': str(access_token),
                'refresh': str(refresh),
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)

        # Ensure that the below snippet is part of a different block or response logic
        # Example: For chat session creation, make a separate block
        chat_session = ChatSession.objects.create(title="Some title")
        return Response({
            "session_id": chat_session.id,
            "session_title": chat_session.title,
            # Uncomment and populate these fields as needed
            # "classification": intent,
            # "entities": entities,
            # "sentiment": sentiment
        }, status=status.HTTP_201_CREATED)
