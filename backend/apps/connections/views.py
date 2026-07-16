from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import Connection

def get_user_connections(user):
    connections = Connection.objects.filter(status="accepted").filter(Q(sender=user) | Q(receiver=user))
    users = []
    for connection in connections:
        users.append(connection.receiver if connection.sender == user else connection.sender)
    return users

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_connections(request):
    user = request.user
    connections = Connection.objects.filter(status='accepted').filter(Q(sender=user) | Q(receiver=user))
    unique_users = {}
    for c in connections:
        other = c.receiver if c.sender == user else c.sender
        unique_users[other.id] = {"id": other.id, "username": other.username}
    return Response(list(unique_users.values()), status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_connection_request(request, receiver_id):
    receiver = get_object_or_404(User, id=receiver_id)
    if request.user == receiver:
        return Response({"error": "Cannot connect with yourself."}, status=status.HTTP_400_BAD_REQUEST)
    
    existing = Connection.objects.filter(Q(sender=request.user, receiver=receiver) | Q(sender=receiver, receiver=request.user)).first()
    if existing:
        return Response({"message": f"Connection is already {existing.status}"}, status=status.HTTP_400_BAD_REQUEST)

    Connection.objects.create(sender=request.user, receiver=receiver, status="pending")
    return Response({"message": "Connection request sent!"}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_requests(request):
    # This handles the "get_requests" requirement
    connections = Connection.objects.filter(receiver=request.user, status='pending')
    data = [{"id": c.id, "username": c.sender.username} for c in connections]
    return Response(data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def handle_connection(request, conn_id):
    action = request.data.get("action")
    try:
        conn = Connection.objects.get(id=conn_id, receiver=request.user, status="pending")
        if action == "accept":
            conn.status = "accepted"
            conn.save()
        else:
            conn.delete()
        return Response({"message": f"Request {action}ed"})
    except Connection.DoesNotExist:
        return Response({"error": "Request not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mutual_connections(request, user_id):
    target_user = get_object_or_404(User, id=user_id)
    my_conns = set(get_user_connections(request.user))
    target_conns = set(get_user_connections(target_user))
    mutual = my_conns.intersection(target_conns)
    return Response([{"id": u.id, "username": u.username} for u in mutual])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def connection_suggestions(request):
    user = request.user
    my_conns = get_user_connections(user)
    suggestions = {}
    for friend in my_conns:
        for conn in Connection.objects.filter(status="accepted").filter(Q(sender=friend) | Q(receiver=friend)):
            candidate = conn.receiver if conn.sender == friend else conn.sender
            if candidate != user and candidate not in my_conns:
                suggestions[candidate.id] = suggestions.get(candidate.id, {"id": candidate.id, "username": candidate.username, "mutual_connections": 0})
                suggestions[candidate.id]["mutual_connections"] += 1
    
    if not suggestions:
        other_users = User.objects.exclude(id=user.id).exclude(id__in=[u.id for u in my_conns])[:10]
        return Response([{"id": u.id, "username": u.username, "mutual_connections": 0} for u in other_users])
    
    return Response(list(suggestions.values()))