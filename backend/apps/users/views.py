from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db.models import Q
from apps.connections.models import Connection
from apps.registrations.models import EventRegistration
from rest_framework.permissions import AllowAny
from rest_framework import status
from apps.users.models import Profile


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_users(request):

    query = request.GET.get("q")

    if not query:
        return Response([])

    users = User.objects.filter(username__icontains=query)[:10]

    results = []

    for user in users:
        results.append({
            "id": user.id,
            "username": user.username
        })

    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request, user_id):

    user = get_object_or_404(User, id=user_id)

    # connections of that user
    connections = Connection.objects.filter(
        status="accepted"
    ).filter(
        Q(sender=user) | Q(receiver=user)
    )

    connections_count = connections.count()

    # mutual connections
    my_connections = Connection.objects.filter(
        status="accepted"
    ).filter(
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

        if conn.sender == user:
            other = conn.receiver
        else:
            other = conn.sender

        if other.id in my_ids:
            mutual.append({
                "id": other.id,
                "username": other.username
            })

    # events attending
    registrations = EventRegistration.objects.filter(user=user)

    events = []

    for reg in registrations:
        event = reg.event

        events.append({
            "id": event.id,
            "title": event.title
        })

    return Response({
        "id": user.id,
        "username": user.username,
        "connections_count": connections_count,
        "mutual_connections": mutual,
        "events_attending": events
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already taken"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password,
        email=email
    )

    Profile.objects.create(user=user)

    return Response(
        {"message": "Account created successfully"},
        status=status.HTTP_201_CREATED
    )