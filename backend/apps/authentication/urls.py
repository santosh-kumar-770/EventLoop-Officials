from django.urls import path
from .views import register_user, verify_email, login_user

urlpatterns = [
    path('register/', register_user, name='register'),
    path('verify-email/', verify_email, name='verify-email'),
    path('login/', login_user, name='login'), # Ensure this points to our custom login view
]