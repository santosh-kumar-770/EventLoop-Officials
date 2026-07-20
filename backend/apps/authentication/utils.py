from django.core.mail import send_mail
from django.conf import settings

def send_verification_email(user, token):
    verification_link = f"http://localhost:5173/verify-email?token={token}"
    subject = "Verify Your EventLoop Account"
    message = f"Hi {user.username},\n\nThank you for signing up for EventLoop! Please verify your email address by clicking the link below:\n\n{verification_link}\n\nIf you did not request this, please ignore this email."
    
    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [user.email],
        fail_silently=False,
    )