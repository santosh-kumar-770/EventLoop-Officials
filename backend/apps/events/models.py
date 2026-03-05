from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    location = models.CharField(max_length=200)
    event_date = models.DateTimeField()
    capacity = models.IntegerField()

    def __str__(self):
        return self.title