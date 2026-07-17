from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Event(models.Model):
    organizer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_events')
    
    # 1. Basic Info
    title = models.CharField(max_length=200)
    tagline = models.CharField(max_length=300, blank=True)
    description = models.TextField()
    category = models.CharField(max_length=50, default="Meetup")
    
    # 2. Date & Time
    start_date = models.DateTimeField(null=True, blank=True) 
    end_date = models.DateTimeField(null=True, blank=True)
    registration_opens = models.DateTimeField(null=True, blank=True)
    registration_closes = models.DateTimeField(null=True, blank=True)
    
    # 3. Location (JSON to handle Online/Offline/Hybrid)
    location_data = models.JSONField(default=dict)
    
    # 4. Organized Data (JSON to handle dynamic lists)
    schedule = models.JSONField(default=list)
    speakers = models.JSONField(default=list)
    prizes = models.JSONField(default=list)
    resources = models.JSONField(default=list)
    
    # 5. Eligibility & Settings
    eligibility = models.JSONField(default=dict)
    custom_registration_form = models.JSONField(default=list)
    is_public = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title