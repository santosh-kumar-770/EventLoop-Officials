from django.contrib.auth.models import User
from django.db import models


class Profile(models.Model):

    YEAR_CHOICES = [
        ('1', 'First Year'),
        ('2', 'Second Year'),
        ('3', 'Third Year'),
        ('4', 'Fourth Year'),
        ('5', 'Fifth Year+'),
        ('alumni', 'Alumni'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True)
    college = models.CharField(max_length=200, blank=True)
    major = models.CharField(max_length=200, blank=True)
    year = models.CharField(max_length=10, choices=YEAR_CHOICES, blank=True)
    skills = models.CharField(max_length=300, blank=True)
    interests = models.CharField(max_length=300, blank=True)
    linkedin = models.URLField(blank=True)
    twitter = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.user.username