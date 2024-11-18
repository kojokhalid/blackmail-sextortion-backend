from django.urls import path
from .views import BotResponseView
from .views import SignUpView,VerifyOTPView,LoginView
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import TokenRefreshView
urlpatterns = [
    path('chat/',BotResponseView.as_view(),name='chat'),
 path('sign-up/', SignUpView.as_view(), name='sign_up'),
    path('get-csrf-token/', views.get_csrf_token, name='get_csrf_token'),
     path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
#      path('login/', LoginView.as_view(), name='login'),
     path('chat/start_session/', views.start_chat_session, name="start_chat_session"),
 path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),


    path('',views.get_routes),path('profile/', views.get_profile)
    ]

