from django.urls import path
from . import views

urlpatterns = [
    path('', views.list_events),
    path('create/', views.create_event),
    path('<int:event_id>/attendees/', views.event_attendees),
    path('recommended/', views.recommended_events),
]
