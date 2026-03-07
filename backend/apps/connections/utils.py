from django.contrib.auth.models import User
from .models import Connection
from django.db.models import Q


def get_user_connections(user):

    connections = Connection.objects.filter(
        Q(sender=user) | Q(receiver=user),
        status="accepted"
    )

    users = []

    for connection in connections:

        if connection.sender == user:
            users.append(connection.receiver)

        else:
            users.append(connection.sender)

    return users