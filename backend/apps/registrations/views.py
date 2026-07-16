from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from apps.events.models import Event
from .models import EventRegistration
# Assuming you create a simple serializer or use this dictionary approach
# I've kept it dictionary-based but cleaned up the logic:

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def register_for_event(request, event_id):
    event = get_object_or_404(Event, id=event_id)

    # Use get_or_create to simplify the logic
    registration, created = EventRegistration.objects.get_or_create(
        user=request.user, 
        event=event
    )
    
    if not created:
        return Response({"error": "Already registered for this event"}, status=status.HTTP_400_BAD_REQUEST)

    return Response({"message": "Successfully registered"}, status=status.HTTP_201_CREATED)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cancel_registration(request, event_id):
    # One-liner deletion attempt
    deleted_count, _ = EventRegistration.objects.filter(
        user=request.user, 
        event_id=event_id
    ).delete()

    if deleted_count == 0:
        return Response({"error": "Registration not found"}, status=status.HTTP_404_NOT_FOUND)

    return Response({"message": "Registration cancelled"}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_registered_events(request):
    # Using values() is faster and cleaner for simple lists
    events = EventRegistration.objects.filter(user=request.user).values(
        'event_id', 
        'event__title'
    )
    return Response(events)