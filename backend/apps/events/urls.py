from django.urls import path
from .views import list_events, create_event, event_attendees

urlpatterns = [
    path('events/', list_events),
    path('events/create/', create_event),
    path('events/<int:event_id>/attendees/', event_attendees)
]