from django.contrib.auth import login

from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer

from feed.models import Post, PostLike, Comment, CommentLike
from feed.serializers import (
    PostCreationSerializer,
    PostListSerializer,
    PostLikeSerializer,
    CommentCreationSerializer,
    CommentListSerializer,
    CommentLikeSerializer,
)
from accounts.serializers import UserCreationSerializer, UserListSerializer

from knox.views import LoginView as KnoxLoginView


# Authentication
class UserCreationView(generics.CreateAPIView):
    """
    Function that creates User model instances

    Returns:
        - 201 Created: with a serialized representation of the user object
        - 400 Bad request: if ValidationError was raised or IntegrityError

    Raises:
        - ValidationError: when failed to validate data
        - IntegrityError: when trying to use registered email
    """

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


class UserRetrieveInformationView(generics.RetrieveAPIView):
    """
    Function that retrieves current loggedin user information

    Returns:
        - 200 Ok: with a serialized representation of the user object
        - 401 Unauthorized: When user didn't provide valid authorization
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserListSerializer

    def get_object(self):
        return self.request.user


# Feed
class PostListCreateView(generics.ListCreateAPIView):
    """
    View that either CREATES or LIST Post model instances

    Returns:
        - 200 Ok: with a serialized representation of the queryset
        - 201 Created: with a serialized representation of the post model object
        - 400 Bad request: when raised ValidationError
        - 401 Unauthorized: when failed to provided valid authentication

    Raises:
        - ValidationError: when invalid request.data was provided

    """

    permission_classes = [permissions.IsAuthenticated]
    queryset = Post.objects.all()
    serializer_class = None

    def get_serializer_class(self):
        if self.request.method == "POST":
            return PostCreationSerializer
        return PostListSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostLikeCreateView(generics.CreateAPIView):
    """
    View that creates a PostLike model instance

    Returns:
        - 201 Created: with a serialized representation of the PostLike model object
        - 400 Bad Request: when raised ValidationError, IntegrityError
        - 401 Unauthorized: when failed to provide valid authorization

    Raises:
        - ValidationError: when request.data provided was invalid
        - IntegrityError: when trying to like twice

    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = PostLikeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostLikeDestroyView(generics.DestroyAPIView):
    """
    View that perfoms the destruction of a PostLike model instance

    Returns:
        - 204 No Content: if an object was deleted
        - 401 Unathorized: when failed to provided valid authentication
        - 404 Not Found: object to be deleted was not found or was not liked by user (based on queryset)
    """

    permission_classes = [permissions.IsAuthenticated]
    queryset = None
    serializer_class = PostLikeSerializer
    lookup_field = "post"

    def get_queryset(self):
        return PostLike.objects.filter(user=self.request.user)


# class CommentListCreateView(generics.ListCreateAPIView):
#     permission_classes = [permissions.IsAuthenticated]
#     queryset = None
#     serializer_class = None

#     def get_serializer_class(self):
#         if self.request.method == "POST":
#             return CommentCreationSerializer
#         return CommentListSerializer

#     def get_queryset(self):
#         if self.request.method == "GET":
#             return Comment


# class CommentLikeCreateView:
#     pass


# class CommentLikeDestroyView:
#     pass
