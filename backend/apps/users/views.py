from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework import status
from apps.connections.models import Connection
from apps.registrations.models import EventRegistration
from apps.users.models import Profile


def serialize_profile(user):
    try:
        p = user.profile
        return {
            "bio": p.bio,
            "college": p.college,
            "major": p.major,
            "year": p.year,
            "skills": p.skills,
            "interests": p.interests,
            "linkedin": p.linkedin,
            "twitter": p.twitter,
        }
    except Exception:
        return {}


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):
    query = request.GET.get("q")
    if not query:
        return Response([])
    users = User.objects.filter(username__icontains=query)[:10]
    results = [{"id": u.id, "username": u.username} for u in users]
    return Response(results)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)

    connections = Connection.objects.filter(status="accepted").filter(
        Q(sender=user) | Q(receiver=user)
    )
    connections_count = connections.count()

    my_connections = Connection.objects.filter(status="accepted").filter(
        Q(sender=request.user) | Q(receiver=request.user)
    )
    my_ids = []
    for conn in my_connections:
        if conn.sender == request.user:
            my_ids.append(conn.receiver.id)
        else:
            my_ids.append(conn.sender.id)

    mutual = []
    for conn in connections:
        other = conn.receiver if conn.sender == user else conn.sender
        if other.id in my_ids:
            mutual.append({"id": other.id, "username": other.username})

    registrations = EventRegistration.objects.filter(user=user)
    events = [{"id": reg.event.id, "title": reg.event.title} for reg in registrations]

    # Connection status between viewer and this user
    conn_status = "none"
    if user == request.user:
        conn_status = "self"
    else:
        existing = Connection.objects.filter(
            Q(sender=request.user, receiver=user) |
            Q(sender=user, receiver=request.user)
        ).first()
        if existing:
            conn_status = existing.status

    return Response({
        "id": user.id,
        "username": user.username,
        "profile": serialize_profile(user),
        "connections_count": connections_count,
        "mutual_connections": mutual,
        "events_attending": events,
        "connection_status": conn_status,
    })


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    fields = ['bio', 'college', 'major', 'year', 'skills', 'interests', 'linkedin', 'twitter']
    for field in fields:
        if field in request.data:
            setattr(profile, field, request.data[field])
    profile.save()
    return Response({"message": "Profile updated", "profile": serialize_profile(request.user)})


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')
    if not username or not password:
        return Response({"error": "Username and password are required"}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)
    user = User.objects.create_user(username=username, password=password, email=email)
    Profile.objects.create(user=user)
    return Response({"message": "Account created successfully"}, status=status.HTTP_201_CREATED)