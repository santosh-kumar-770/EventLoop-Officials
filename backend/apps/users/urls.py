from django.urls import path
from .views import register_user, search_users, user_profile, update_profile

urlpatterns = [
    path('register/', register_user, name='auth_register'),
    path('search/', search_users, name='search_users'),
    path('profile/update/', update_profile, name='update_profile'),
    path('<int:user_id>/', user_profile, name='user_profile'), 
]