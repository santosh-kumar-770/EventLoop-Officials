from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from apps.events.models import Event
from .models import EventRegistration


# Register for an event
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_for_event(request, event_id):

    try:
        event = Event.objects.get(id=event_id)
    except Event.DoesNotExist:
        return Response({"error": "Event not found"}, status=404)

    # prevent duplicate registration
    if EventRegistration.objects.filter(user=request.user, event=event).exists():
        return Response({"error": "Already registered for this event"}, status=400)

    EventRegistration.objects.create(
        user=request.user,
        event=event
    )

    return Response(
        {"message": "Successfully registered"},
        status=status.HTTP_201_CREATED
    )


# Cancel registration
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_registration(request, event_id):

    try:
        registration = EventRegistration.objects.get(
            user=request.user,
            event_id=event_id
        )
    except EventRegistration.DoesNotExist:
        return Response({"error": "Registration not found"}, status=404)

    registration.delete()

    return Response({"message": "Registration cancelled"})


# My registered events
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_registered_events(request):

    registrations = EventRegistration.objects.filter(user=request.user)

    events = []

    for reg in registrations:
        event = reg.event

        events.append({
            "event_id": event.id,
            "title": event.title
        })

    return Response(events)