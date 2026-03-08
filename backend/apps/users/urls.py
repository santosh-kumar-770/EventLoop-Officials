from django.urls import path
from . import views

urlpatterns = [

    path('search/', views.search_users),

    path('<int:user_id>/', views.user_profile),

]