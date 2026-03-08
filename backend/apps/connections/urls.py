from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_connection_request),
    path('accept/', views.accept_connection_request),
    path('my/', views.my_connections),
    path('pending/', views.pending_requests),
    path('reject/', views.reject_connection_request),
    path('mutual/<int:user_id>/', views.mutual_connections),
    path('suggestions/', views.connection_suggestions),
]