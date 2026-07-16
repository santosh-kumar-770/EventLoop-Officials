from django.urls import path
from . import views

urlpatterns = [

    path('<int:event_id>/register/', views.register_for_event),
    path('<int:event_id>/cancel/', views.cancel_registration),
    path('my/', views.my_registered_events),

    path('register/<int:event_id>/', views.register_for_event, name='register_for_event'),
    path('cancel/<int:event_id>/', views.cancel_registration, name='cancel_registration'),
    path('my/', views.my_registered_events, name='my_registered_events'),

]