from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Q
from django.shortcuts import get_object_or_404

from apps.connections.models import Connection
from apps.registrations.models import EventRegistration
from .models import Event
from .serializers import EventSerializer


# --------------------------------
# List All Events
# --------------------------------

@api_view(['GET'])
@permission_classes([AllowAny])
def list_events(request):
    page = int(request.GET.get("page", 1))
    limit = int(request.GET.get("limit", 10))
    start = (page - 1) * limit
    end = start + limit
    events = Event.objects.all()[start:end]
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


# --------------------------------
# Create Event
# --------------------------------

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_event(request):
    serializer = EventSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --------------------------------
# Register for Event
# --------------------------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def register_event(request):
    event_id = request.data.get("event")
    if not event_id:
        return Response({"error": "Event ID required"}, status=status.HTTP_400_BAD_REQUEST)
    event = get_object_or_404(Event, id=event_id)
    if EventRegistration.objects.filter(user=request.user, event=event).exists():
        return Response({"message": "Already registered for this event"}, status=status.HTTP_400_BAD_REQUEST)
    EventRegistration.objects.create(user=request.user, event=event)
    return Response({"message": "Registered successfully"}, status=status.HTTP_201_CREATED)


# --------------------------------
# Event Attendees (Pre-event Lobby)
# --------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_attendees(request, event_id):
    event = get_object_or_404(Event, id=event_id)
    registrations = EventRegistration.objects.filter(event_id=event_id).select_related('user')

    # Build connection map for current user
    all_connections = Connection.objects.filter(
        Q(sender=request.user) | Q(receiver=request.user)
    )
    connection_map = {}
    for conn in all_connections:
        other = conn.receiver if conn.sender == request.user else conn.sender
        connection_map[other.id] = {
            "status": conn.status,
            "connection_id": conn.id,
            "i_sent": conn.sender == request.user
        }

    attendees = []
    for reg in registrations:
        user = reg.user

        if user == request.user:
            conn_info = {"status": "self"}
        elif user.id in connection_map:
            conn_info = connection_map[user.id]
        else:
            conn_info = {"status": "none"}

        profile = {}
        try:
            p = user.profile
            profile = {
                "bio": p.bio or "",
                "college": p.college or "",
                "skills": p.skills or "",
            }
        except Exception:
            pass

        attendees.append({
            "id": user.id,
            "username": user.username,
            "profile": profile,
            "connection": conn_info,
        })

    return Response({
        "event": {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "location": event.location,
            "event_date": event.event_date,
            "capacity": event.capacity,
        },
        "total_attendees": len(attendees),
        "attendees": attendees,
    })


# --------------------------------
# Recommended Events
# --------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def recommended_events(request):
    user = request.user
    connections = Connection.objects.filter(status="accepted").filter(
        Q(sender=user) | Q(receiver=user)
    )
    connection_ids = []
    for conn in connections:
        if conn.sender == user:
            connection_ids.append(conn.receiver.id)
        else:
            connection_ids.append(conn.sender.id)
    registrations = EventRegistration.objects.filter(user_id__in=connection_ids)
    events = []
    for reg in registrations:
        event = reg.event
        events.append({
            "event_id": event.id,
            "title": event.title,
            "connection": reg.user.username
        })
    return Response(events)