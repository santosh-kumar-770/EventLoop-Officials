from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Event
from .serializers import EventSerializer
from apps.registrations.models import EventRegistration
from apps.registrations.serializers import AttendeeSerializer
from .services import get_event_attendees

@api_view(['GET'])
def event_attendees(request, event_id):

    registrations = get_event_attendees(event_id)

    serializer = AttendeeSerializer(registrations, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def event_attendees(request, event_id):
    registrations = EventRegistration.objects.filter(event_id=event_id)
    serializer = AttendeeSerializer(registrations, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def list_events(request):
    events = Event.objects.all()
    serializer = EventSerializer(events, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_event(request):
    serializer = EventSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)


@api_view(['GET'])
def event_attendees(request, event_id):
    registrations = EventRegistration.objects.filter(event_id=event_id)

    attendees = []

    for reg in registrations:
        user = reg.user
        attendees.append({
            "user_id": user.id,
            "username": user.username
        })

    return Response(attendees)