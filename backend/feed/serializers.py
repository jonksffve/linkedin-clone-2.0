from rest_framework import serializers
from .models import Post, PostLike, Comment, CommentLike
from accounts.serializers import UserListSerializer


class PostSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    image = serializers.ImageField(allow_empty_file=True, required=False, default=None)
    video = serializers.FileField(allow_empty_file=True, required=False, default=None)

    class Meta:
        model = Post
        fields = ["id", "user", "title", "content", "date_created", "image", "video"]


class CommentSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)
    parent = serializers.PrimaryKeyRelatedField(
        queryset=Comment.objects.all(), required=False, allow_null=True, default=None
    )
    replies_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = [
            "id",
            "post",
            "user",
            "content",
            "date_created",
            "parent",
            "replies_count",
        ]

    def get_replies_count(self, obj):
        return obj.replies.count()

    # validation replies
    def validate_parent(self, parent):
        try:
            post_id = self.initial_data["post"]
        except:
            post_id = None

        if parent and post_id and parent.post.id != post_id:
            raise serializers.ValidationError(
                "Reply must be from the same post as the comment."
            )

        return parent


class PostLikeSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)

    class Meta:
        model = PostLike
        fields = ["post", "user"]


class CommentLikeSerializer(serializers.ModelSerializer):
    user = UserListSerializer(read_only=True)

    class Meta:
        model = CommentLike
        fields = ["comment", "user"]
