from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.search_users, name='search_users'),
    path('profile/<int:user_id>/', views.user_profile, name='user_profile'),
    path('profile/update/', views.update_profile, name='update_profile'),
    path('register/', views.register_user, name='register_user'),
]