from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Connection
from .serializers import ConnectionSerializer


@api_view(['POST'])
def send_connection_request(request):

    serializer = ConnectionSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)