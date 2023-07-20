from django.contrib.auth import login

from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer

from accounts.models import CustomUser
from accounts.serializers import UserCreationSerializer

from knox.views import LoginView as KnoxLoginView


class UserCreationView(generics.CreateAPIView):
    """
    Function that creates User model instances

    Returns:
        - 200 Ok: with a serialized representation of the object
        - 400 Bad request: if ValidationError was raised

    Raises:
        - ValidationError: when failed to validate data
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserCreationSerializer


class LoginView(KnoxLoginView):
    """
    Function that allow our users to authenticate themselves
    [ref] https://james1345.github.io/django-rest-knox/auth/#global-usage-on-all-views

    Returns:
        - 200 Ok: with a serialized representation that includes token, expiry, user
        - 400 Bad request: when ValidationError thrown or user could not be found in db

    Raises:
        - ValidationError: when failed to validate data
    """

    permission_classes = [permissions.AllowAny]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)
