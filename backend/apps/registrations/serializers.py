from rest_framework import serializers
from .models import EventRegistration


class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistration
        fields = '__all__'


class AttendeeSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")

    class Meta:
        model = EventRegistration
        fields = ["user", "username"]