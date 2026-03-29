from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.db.models import Q
from django.contrib.auth.models import User

from .models import Connection
from .serializers import ConnectionSerializer


# ----------------------------------------
# Helper Function
# ----------------------------------------

def get_user_connections(user):

    connections = Connection.objects.filter(
        status="accepted"
    ).filter(
        Q(sender=user) | Q(receiver=user)
    )

    users = []

    for connection in connections:

        if connection.sender == user:
            users.append(connection.receiver)
        else:
            users.append(connection.sender)

    return users


# ----------------------------------------
# My Connections
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_connections(request):

    user = request.user

    connections = Connection.objects.filter(
        status='accepted'
    ).filter(
        Q(sender=user) | Q(receiver=user)
    )

    unique_users = {}

    for connection in connections:

        if connection.sender == user:
            other = connection.receiver
        else:
            other = connection.sender

        unique_users[other.id] = {
            "id": other.id,
            "username": other.username
        }

    return Response(list(unique_users.values()), status=status.HTTP_200_OK)


# ----------------------------------------
# Send Connection Request
# ----------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection_request(request):

    receiver_id = request.data.get("receiver")

    if not receiver_id:
        return Response({"error": "Receiver id required"}, status=400)

    if int(receiver_id) == request.user.id:
        return Response({"error": "You cannot connect with yourself"}, status=400)

    try:
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    # check existing connection
    existing = Connection.objects.filter(
        Q(sender=request.user, receiver=receiver) |
        Q(sender=receiver, receiver=request.user)
    ).first()

    if existing:
        return Response({"error": "Connection already exists or pending"}, status=400)

    connection = Connection.objects.create(
        sender=request.user,
        receiver=receiver,
        status="pending"
    )

    serializer = ConnectionSerializer(connection)

    return Response(serializer.data, status=201)


# ----------------------------------------
# Pending Requests
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_requests(request):

    user = request.user

    connections = Connection.objects.filter(
        receiver=user,
        status='pending'
    )

    users = []

    for connection in connections:
        users.append({
            "connection_id": connection.id,
            "id": connection.sender.id,
            "username": connection.sender.username
        })

    return Response(users, status=200)


# ----------------------------------------
# Accept Request
# ----------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_connection_request(request):

    connection_id = request.data.get("connection_id")

    try:
        connection = Connection.objects.get(
            id=connection_id,
            receiver=request.user,
            status="pending"
        )

        connection.status = "accepted"
        connection.save()

        return Response({"message": "Connection accepted"}, status=200)

    except Connection.DoesNotExist:
        return Response({"error": "Connection not found"}, status=404)


# ----------------------------------------
# Reject Request
# ----------------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_connection_request(request):

    connection_id = request.data.get("connection_id")

    try:
        connection = Connection.objects.get(
            id=connection_id,
            receiver=request.user,
            status="pending"
        )

        connection.delete()

        return Response({"message": "Connection request rejected"}, status=200)

    except Connection.DoesNotExist:
        return Response({"error": "Connection not found"}, status=404)


# ----------------------------------------
# Mutual Connections API
# ----------------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mutual_connections(request, user_id):

    try:
        target_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)

    my_connections = set(get_user_connections(request.user))
    target_connections = set(get_user_connections(target_user))

    mutual = my_connections.intersection(target_connections)

    result = []

    for user in mutual:
        result.append({
            "id": user.id,
            "username": user.username
        })

    return Response(result, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def connection_suggestions(request):

    user = request.user

    # Step 1: get my connections
    connections = Connection.objects.filter(
        status="accepted"
    ).filter(
        Q(sender=user) | Q(receiver=user)
    )

    my_connections = []

    for conn in connections:

        if conn.sender == user:
            my_connections.append(conn.receiver)

        else:
            my_connections.append(conn.sender)

    # Step 2: find friends of friends
    suggestions = {}

    for friend in my_connections:

        friend_connections = Connection.objects.filter(
            status="accepted"
        ).filter(
            Q(sender=friend) | Q(receiver=friend)
        )

        for conn in friend_connections:

            if conn.sender == friend:
                candidate = conn.receiver
            else:
                candidate = conn.sender

            # skip yourself
            if candidate == user:
                continue

            # skip if already connected
            if candidate in my_connections:
                continue

            # count mutual connections
            if candidate.id not in suggestions:
                suggestions[candidate.id] = {
                    "id": candidate.id,
                    "username": candidate.username,
                    "mutual_connections": 1
                }
            else:
                suggestions[candidate.id]["mutual_connections"] += 1

    # Fallback: if no friend-of-friend suggestions, show all other users
    if not suggestions:
        pending_ids = Connection.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).values_list('sender_id', 'receiver_id')

        excluded_ids = set()
        excluded_ids.add(user.id)
        for sender_id, receiver_id in pending_ids:
            excluded_ids.add(sender_id)
            excluded_ids.add(receiver_id)

        other_users = User.objects.exclude(id__in=excluded_ids)[:10]

        fallback = []
        for u in other_users:
            fallback.append({
                "id": u.id,
                "username": u.username,
                "mutual_connections": 0
            })

        return Response(fallback)

    return Response(list(suggestions.values()))