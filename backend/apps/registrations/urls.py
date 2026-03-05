from django.urls import path
from .views import register_event

urlpatterns = [
    path('events/register/', register_event),
]