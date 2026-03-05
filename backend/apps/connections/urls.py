from django.urls import path
from .views import send_connection_request

urlpatterns = [
    path('connections/send/', send_connection_request),
]