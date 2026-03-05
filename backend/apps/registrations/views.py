from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import EventRegistration
from .serializers import RegistrationSerializer


@api_view(['POST'])
def register_event(request):
    serializer = RegistrationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors)