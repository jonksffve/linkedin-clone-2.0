from rest_framework import serializers
from .models import Post, PostLike, Comment, CommentLike
from accounts.serializers import UserListSerializer


class PostCreationSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)

    class Meta:
        model = Post
        fields = ["title", "content", "image", "video", "user"]


class PostListSerializer(serializers.ModelSerializer):
    user = UserListSerializer()

    class Meta:
        model = Post
        fields = ["id", "user", "title", "content", "date_created", "image", "video"]


class CommentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["post", "content", "parent"]


class CommentListSerializer(serializers.ModelSerializer):
    user = UserListSerializer()

    class Meta:
        model = Comment
        fields = ["id", "post", "user", "content", "date_created", "parent"]


class PostLikeSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)

    class Meta:
        model = PostLike
        fields = ["post", "user"]


class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserListSerializer()

    class Meta:
        model = CommentLike
        fields = ["comment", "user"]
        read_only_fields = ["user"]
