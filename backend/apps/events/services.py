from apps.registrations.models import EventRegistration

def get_event_attendees(event_id):
    return EventRegistration.objects.filter(event_id=event_id)