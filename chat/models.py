from django.contrib.auth.models import AbstractBaseUser, BaseUserManager,User
from django.db import models
from django.utils import timezone
from datetime import timedelta
from django.utils.crypto import get_random_string 
from django.conf import settings
import uuid

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()

    def __str__(self):
        return self.user.username
    
class ChatSession(models.Model):
    id = models.AutoField(primary_key=True)  # Integer-based primary key
    session_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)  # Separate UUID field
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True) 
class ChatMessage(models.Model):
    session = models.ForeignKey(ChatSession, on_delete=models.CASCADE, related_name="messages")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    user_message = models.TextField()
    bot_response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Message in {self.session.title} at {self.timestamp}"
  
class OTP(models.Model):
    # Use the custom user model dynamically by referring to the `AUTH_USER_MODEL` setting
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Correct reference to the custom user model
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()

    def is_expired(self):
        return timezone.now() > self.expires_at

    def __str__(self):
        return f"OTP for {self.user.email} - {self.otp}"

    @classmethod
    def generate_otp(cls, user):
        otp = get_random_string(length=6, allowed_chars='0123456789')
        expiration_time = timezone.now() + timedelta(minutes=10)  # OTP expires in 10 minutes
        otp_instance = cls.objects.create(user=user, otp=otp, expires_at=expiration_time)
        return otp_instance

   