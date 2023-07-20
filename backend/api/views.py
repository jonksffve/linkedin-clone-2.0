from rest_framework import generics
from accounts.models import CustomUser
from accounts.serializers import UserCreationSerializer


class UserCreationView(generics.CreateAPIView):
    """
    Function that creates User model instances

    Returns:
        - 200 OK: with a serialized representation of the object
        - 400 Bad Request: if ValidationError was raised

    Raises:
        - ValidationError: when failed to validate data
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserCreationSerializer
