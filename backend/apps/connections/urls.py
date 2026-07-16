from django.urls import path
from . import views

urlpatterns = [
    path('my/', views.my_connections, name='my_connections'),
    path('pending/', views.pending_requests, name='pending_requests'),
    path('requests/', views.pending_requests, name='get_requests'), # Alias for your frontend call
    path('handle/<int:conn_id>/', views.handle_connection, name='handle_connection'),
    path('mutual/<int:user_id>/', views.mutual_connections, name='mutual_connections'),
    path('suggestions/', views.connection_suggestions, name='connection_suggestions'),
    path('request/<int:receiver_id>/', views.send_connection_request, name='send_request'),
]