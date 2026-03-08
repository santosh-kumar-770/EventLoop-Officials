from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from apps.connections.models import Connection
from django.db.models import Q
from .models import Event
from .serializers import EventSerializer
from apps.registrations.models import EventRegistration


# --------------------------------
# List All Events
# --------------------------------

@api_view(['GET'])
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
# Event Attendees
# --------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def event_attendees(request, event_id):

    registrations = EventRegistration.objects.filter(event_id=event_id)

    attendees = []
    attendee_ids = []

    for reg in registrations:
        user = reg.user

        attendee_ids.append(user.id)

        attendees.append({
            "id": user.id,
            "username": user.username
        })

    # get user's connections
    connections = Connection.objects.filter(
        status="accepted"
    ).filter(
        Q(sender=request.user) | Q(receiver=request.user)
    )

    connection_ids = []

    for conn in connections:

        if conn.sender == request.user:
            connection_ids.append(conn.receiver.id)
        else:
            connection_ids.append(conn.sender.id)

    # find which connections are attending
    connections_attending = []

    for user in attendees:

        if user["id"] in connection_ids:
            connections_attending.append(user)

    return Response({
        "total_attendees": registrations.count(),
        "attendees": attendees,
        "your_connections_attending": connections_attending
    })


@api_view(['GET'])
def recommended_events(request):

    user = request.user

    connections = Connection.objects.filter(
        status="accepted"
    ).filter(
        Q(sender=user) | Q(receiver=user)
    )

    connection_ids = []

    for conn in connections:

        if conn.sender == user:
            connection_ids.append(conn.receiver.id)
        else:
            connection_ids.append(conn.sender.id)

    registrations = EventRegistration.objects.filter(
        user_id__in=connection_ids
    )

    events = []

    for reg in registrations:

        event = reg.event

        events.append({
            "event_id": event.id,
            "title": event.title,
            "connection": reg.user.username
        })

    return Response(events)