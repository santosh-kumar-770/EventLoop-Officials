from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import AnonymousUser
from apps.events.models import Event
from apps.connections.models import Connection
from apps.registrations.models import EventRegistration

@api_view(['GET'])
def dashboard(request):

    user = request.user

    # upcoming events
    events = Event.objects.all()[:5]

    upcoming_events = [
        {"id": e.id, "title": e.title}
        for e in events
    ]

    connections_activity = []

    # only run connection logic if user is authenticated
    if not isinstance(user, AnonymousUser):

        connections = Connection.objects.filter(
            status="accepted"
        ).filter(
            Q(sender=user) | Q(receiver=user)
        )

        connections_activity = [
            {
                "id": c.id,
                # Fix: Send these as objects so React can read them correctly
                "sender": {"id": c.sender.id, "username": c.sender.username},
                "receiver": {"id": c.receiver.id, "username": c.receiver.username}
            }
            for c in connections
        ]

    return Response({
        "upcoming_events": upcoming_events,
        "connections_activity": connections_activity
    })