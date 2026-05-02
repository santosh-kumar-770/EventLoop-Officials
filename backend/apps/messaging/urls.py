from django.urls import path
from . import views

urlpatterns = [
    path('send/', views.send_message),
    path('inbox/', views.get_inbox),
    path('unread/', views.unread_count),
    path('conversation/<int:user_id>/', views.get_conversation),
]