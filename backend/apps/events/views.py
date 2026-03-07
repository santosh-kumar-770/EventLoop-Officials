from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Event
from .serializers import EventSerializer
from apps.registrations.models import EventRegistration


# --------------------------------
# List All Events
# --------------------------------

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def list_events(request):

    events = Event.objects.all()

    serializer = EventSerializer(events, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


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

    for reg in registrations:

        user = reg.user

        attendees.append({
            "user_id": user.id,
            "username": user.username
        })

    return Response({
        "event_id": event_id,
        "total_attendees": registrations.count(),
        "attendees": attendees
    }, status=status.HTTP_200_OK)