import uuid
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from apps.users.models import Profile
from .utils import send_verification_email

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({"error": "Email is already registered."}, status=status.HTTP_400_BAD_REQUEST)

    # 1. Create standard Django user
    user = User.objects.create_user(username=username, email=email, password=password)

    # 2. Generate token and update their Profile
    token = str(uuid.uuid4())
    profile = user.profile  # fetched via the OneToOne relationship
    profile.verification_token = token
    profile.is_email_verified = False
    profile.role = 'standard'
    profile.save()

    # Send verification email
    try:
        send_verification_email(user, token)
    except Exception as e:
        print("Email sending failed:", e)

    return Response({
        "message": "Registration successful! Please check your email to verify your account."
    }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email(request):
    token = request.data.get('token')
    if not token:
        return Response({"error": "Token is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        profile = Profile.objects.get(verification_token=token)
        profile.is_email_verified = True
        profile.verification_token = None
        profile.save()
        return Response({"message": "Email verified successfully! You can now log in."}, status=status.HTTP_200_OK)
    except Profile.DoesNotExist:
        return Response({"error": "Invalid or expired verification token."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({"error": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user is None:
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)

    # Check profile verification status
    if hasattr(user, 'profile') and not user.profile.is_email_verified:
        return Response(
            {"error": "Please verify your email address before logging in. Check your inbox."}, 
            status=status.HTTP_403_FORBIDDEN
        )

    refresh = RefreshToken.for_user(user)
    return Response({
        "refresh": str(refresh),
        "access": str(refresh.access_token),
        "message": "Login successful!"
    }, status=status.HTTP_200_OK)