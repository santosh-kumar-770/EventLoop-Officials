from django.urls import path
from . import views

urlpatterns = [

    path('<int:event_id>/register/', views.register_for_event),

    path('<int:event_id>/cancel/', views.cancel_registration),

    path('my/', views.my_registered_events),

]