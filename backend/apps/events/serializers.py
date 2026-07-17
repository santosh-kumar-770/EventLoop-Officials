from rest_framework import serializers
from .models import Event

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        # Include all the new fields we added to the model
        fields = [
            'id', 'title', 'tagline', 'description', 'category', 
            'start_date', 'end_date', 'registration_opens', 
            'registration_closes', 'location_data', 'schedule', 
            'speakers', 'prizes', 'resources', 'eligibility', 
            'custom_registration_form', 'is_public'
        ]