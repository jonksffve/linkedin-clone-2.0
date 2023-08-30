from django.contrib.auth import login
from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions
from rest_framework.authtoken.serializers import AuthTokenSerializer

from feed.models import Post, PostLike, Comment, CommentLike
from feed.serializers import (
    PostSerializer,
    PostLikeSerializer,
    CommentSerializer,
    CommentLikeSerializer,
)

from accounts.serializers import (
    UserCreationSerializer,
    UserListSerializer,
    UserInformationUpdateSerializer,
    UserAvatarUpdateSerializer,
    UserBannerUpdateSerializer,
)
from accounts.models import CustomUser

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
    Function that retrieves user information

    Returns:
        - 200 Ok: with a serialized representation of the user object
        - 401 Unauthorized: When user didn't provide valid authorization
        - 404 Not found: When failed to lookup user information with given email
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserListSerializer

    def get_object(self):
        if "email" in self.request.query_params:
            email = self.request.query_params["email"]
            user = get_object_or_404(CustomUser, email=email)
            return user
        return self.request.user


# Accounts
class UserUpdateView(generics.UpdateAPIView):
    """
    View that allow users to edit their accounts

    Returns:
        - 200 OK: with a serialized representation of the CustomUser object instance.
        - 400 Bad Request: when data provided was invalid.
        - 401 Unauthorized: when failed to provide valid user authentication.

    Accepts:
        - PATCH: only partial updates on a model instance.
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserInformationUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        return self.request.user


class UserUpdateAvatarView(generics.UpdateAPIView):
    """
    View that allow users to edit their avatar image

    Returns:
        - 200 Ok: with a serialized representation of the CustomUser object instance.
        - 400 Bad Request: when data provided was invalid.
        - 401 Unauthorized: when failed to provide valid user authentication.

    Accepts:
        - PATCH: only partial updates on a model instance
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserAvatarUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

    def get_object(self):
        return self.request.user


class UserUpdateBannerView(generics.UpdateAPIView):
    """
    View that allow users to edit their banner image

    Returns:
        - 200 Ok: with a serialized representation of the CustomUser object instance.
        - 400 Bad Request: when data provided was invalid.
        - 401 Unauthorized: when failed to provide valid user authentication.

    Accepts:
        - PATCH: only partial updates on a model instance
    """

    queryset = CustomUser.objects.all()
    serializer_class = UserBannerUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ["patch"]

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
    serializer_class = PostSerializer

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


class CommentListCreateView(generics.ListCreateAPIView):
    """
    Function that either CREATES or LIST a Comment model instance

    Returns:
        - 200 Ok: with serialized representation of the Comments queryset
        - 201 Created: with a serialized representation of the Comment object
        - 400 Bad Request: when raised ValidationError/ValueError
        - 401 Unauthorized: when failed to provide valid authentication

    Raises:
        - ValidationError: when request.data provided was invalid
        - ValueError: when request does not contain "post_id" in query_params
    """

    permission_classes = [permissions.IsAuthenticated]
    queryset = None
    serializer_class = CommentSerializer

    def get_queryset(self):
        """
        View that determines if we return a MainComments queryset or a Replies to a comment queryset
        """
        if self.request.method == "GET":
            # If post_id is given, we want main comments
            if "post_id" in self.request.query_params:
                return Comment.objects.filter(
                    post=self.request.query_params["post_id"], parent__isnull=True
                )

            # If we provide a "parent_id", then we want replies to that comment
            if "parent_id" in self.request.query_params:
                return Comment.objects.filter(
                    parent=self.request.query_params["parent_id"]
                )
            return Comment.objects.none()

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentLikeCreateView(generics.CreateAPIView):
    """
    View that creates a CommentLike model instance

    Returns:
        - 201 Created: with a serialized representation of the CommentLike object
        - 400 Bad Request: if ValidationError is raised
        - 401 Unauthorized: if we failed to provide valid authentication

    Raises:
        - ValidationError: when request.data provided was invalid
        - IntegrityError: when trying to like twice
    """

    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CommentLikeSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CommentLikeDestroyView(generics.DestroyAPIView):
    """
    View that destroys a CommentLike model instance

    Returns:
        - 204 No Content: when object is deleted
        - 401 Unauthorized: when failed to provide valid authentication
        - 404 Not Found: when failed to delete object
    """

    permission_classes = [permissions.IsAuthenticated]
    queryset = None
    serializer_class = CommentLikeSerializer
    lookup_field = "comment"

    def get_queryset(self):
        return CommentLike.objects.filter(user=self.request.user)
