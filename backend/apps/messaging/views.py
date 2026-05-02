from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from django.contrib.auth.models import User

from .models import Message
from .serializers import MessageSerializer
from apps.connections.models import Connection


def are_connected(user1, user2):
    return Connection.objects.filter(status='accepted').filter(
        Q(sender=user1, receiver=user2) | Q(sender=user2, receiver=user1)
    ).exists()


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_message(request):
    receiver_id = request.data.get('receiver')
    content = request.data.get('content', '').strip()
    if not receiver_id:
        return Response({'error': 'Receiver id required'}, status=400)
    if not content:
        return Response({'error': 'Message cannot be empty'}, status=400)
    if int(receiver_id) == request.user.id:
        return Response({'error': 'Cannot message yourself'}, status=400)
    try:
        receiver = User.objects.get(id=receiver_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    if not are_connected(request.user, receiver):
        return Response({'error': 'You can only message your connections'}, status=403)
    message = Message.objects.create(sender=request.user, receiver=receiver, content=content)
    return Response(MessageSerializer(message).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_conversation(request, user_id):
    try:
        other_user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)
    if not are_connected(request.user, other_user):
        return Response({'error': 'Not connected'}, status=403)
    messages = Message.objects.filter(
        Q(sender=request.user, receiver=other_user) |
        Q(sender=other_user, receiver=request.user)
    ).order_by('created_at')
    messages.filter(receiver=request.user, is_read=False).update(is_read=True)
    return Response(MessageSerializer(messages, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_inbox(request):
    user = request.user
    sent_to = Message.objects.filter(sender=user).values_list('receiver_id', flat=True)
    received_from = Message.objects.filter(receiver=user).values_list('sender_id', flat=True)
    conversation_user_ids = set(list(sent_to) + list(received_from))
    inbox = []
    for uid in conversation_user_ids:
        try:
            other = User.objects.get(id=uid)
        except User.DoesNotExist:
            continue
        last_message = Message.objects.filter(
            Q(sender=user, receiver=other) | Q(sender=other, receiver=user)
        ).order_by('-created_at').first()
        unread_count = Message.objects.filter(sender=other, receiver=user, is_read=False).count()
        inbox.append({
            'user_id': other.id,
            'username': other.username,
            'last_message': last_message.content if last_message else '',
            'last_message_time': last_message.created_at if last_message else None,
            'unread_count': unread_count,
            'is_mine': last_message.sender == user if last_message else False,
        })
    inbox.sort(key=lambda x: x['last_message_time'] or '', reverse=True)
    return Response(inbox)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def unread_count(request):
    count = Message.objects.filter(receiver=request.user, is_read=False).count()
    return Response({'unread_count': count})