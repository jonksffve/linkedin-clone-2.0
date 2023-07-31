from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from accounts.models import CustomUser
from accounts.serializers import UserListSerializer


from ..models import Post, Comment, PostLike, CommentLike
from ..serializers import (
    PostSerializer,
    CommentSerializer,
    PostLikeSerializer,
    CommentLikeSerializer,
)


class TestPostSerializer(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="test@user.com",
            password="testpassword",
            first_name="hello",
            last_name="goodbye",
        )

        self.raw_post = Post.objects.create(
            user=self.user, content="Raw object's content"
        )

    def test_post_serialization(self):
        serializer = PostSerializer(instance=self.raw_post)

        # serialization
        serialized_data = serializer.data

        # check fields in the serializer
        self.assertEqual(len(serialized_data), 8)
        self.assertEqual(serialized_data["id"], self.raw_post.id)
        self.assertEqual(serialized_data["user"]["id"], self.raw_post.user.id)
        self.assertEqual(serialized_data["content"], self.raw_post.content)
        self.assertIsNotNone(serialized_data["date_created"])
        self.assertIsNone(serialized_data["file"])
        self.assertIn("is_liked", serialized_data)
        self.assertIn("comments", serialized_data)
        self.assertIn("likes", serialized_data)

    def test_post_serialization_multiple(self):
        # Create multiple test posts
        Post.objects.create(
            content="This is another test post.",
            user=self.user,
        )

        Post.objects.create(
            content="This is a third test post.",
            user=self.user,
        )

        queryset = Post.objects.all()
        serializer = PostSerializer(instance=queryset, many=True)

        # Check the serialized data for multiple instances
        self.assertEqual(len(serializer.data), 3)  # Three posts serialized

    def test_post_serialization_user_serialization(self):
        serializer = PostSerializer(instance=self.raw_post)

        # serialization
        serialized_data = serializer.data

        user_serializer = UserListSerializer(instance=self.user)

        self.assertEqual(serialized_data["user"], user_serializer.data)

    def test_post_deserialization_valid_data_with_file(self):
        with open("media/test_files/nerdy.jpg", "rb") as file:
            valid_data = {
                "content": "This is a content",
                "file": SimpleUploadedFile(file.name, file.read()),
            }

            serializer = PostSerializer(data=valid_data)
            self.assertTrue(serializer.is_valid())
            post_instance = serializer.save(user=self.user)
            self.assertIsInstance(post_instance, Post)
            self.assertEqual(post_instance.content, valid_data["content"])
            self.assertEqual(post_instance.user.id, self.user.id)
            self.assertIsNotNone(post_instance.date_created)
            self.assertIsNotNone(post_instance.file)

    def test_post_deserialization_valid_data_without_file(self):
        valid_data = {"content": "This is a content"}
        serializer = PostSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        post_instance = serializer.save(user=self.user)

        self.assertIsInstance(post_instance, Post)
        self.assertEqual(post_instance.content, valid_data["content"])
        self.assertEqual(post_instance.user.id, self.user.id)
        self.assertIsNotNone(post_instance.date_created)
        self.assertEqual(post_instance.file, None)

    def test_post_deserialization_invalid_data(self):
        # no data
        invalid_data = {}
        serializer = PostSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("content", serializer.errors)

        # wrong content type (Field level validation)
        invalid_files = [
            "media/test_files/wrong.txt",
            "media/test_files/document.pdf",
            "media/test_files/audio.mp3",
        ]

        for path in invalid_files:
            with open(path, "rb") as file:
                data = {
                    "content": "This post contains an image.",
                    "file": SimpleUploadedFile(file.name, file.read()),
                }

                serializer = PostSerializer(data=data)
                self.assertFalse(serializer.is_valid())
                self.assertEqual(len(serializer.errors), 1)
                self.assertIn("file", serializer.errors)


class TestCommentSerializer(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="user@site.com", password="testpass"
        )

        self.post = Post.objects.create(user=self.user, content="This a content")

        self.raw_comment = Comment.objects.create(
            post=self.post, user=self.user, content="This a comment content"
        )

        self.expected_data_comment = {
            "post": self.post.id,
            "content": "This is a comment.",
        }

        self.expected_data_reply = {
            "post": self.post.id,
            "content": "This is a reply",
            "parent": self.raw_comment.id,
        }

    def test_comment_deserialization_valid_data(self):
        serializer = CommentSerializer(data=self.expected_data_comment)

        self.assertTrue(serializer.is_valid())

        # get the model instance
        comment_instance = serializer.save(user=self.user)

        self.assertIsInstance(comment_instance, Comment)
        # Checking fields of the deserialized representation
        self.assertEqual(comment_instance.post, self.post)
        self.assertEqual(comment_instance.user, self.user)
        self.assertEqual(
            comment_instance.content, self.expected_data_comment["content"]
        )
        self.assertIsNotNone(comment_instance.date_created)
        self.assertIsNone(comment_instance.parent)

    def test_comment_deserialization_invalid_data_cases(self):
        # no data
        invalid_data = {}

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 2)
        self.assertIn("post", serializer.errors)
        self.assertIn("content", serializer.errors)

        # no post
        invalid_data = {"content": "this is a content"}

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("post", serializer.errors)

        # no content
        invalid_data = {"post": self.post.id}

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("content", serializer.errors)

    def test_reply_deserialization_valid_data(self):
        serializer = CommentSerializer(data=self.expected_data_reply)

        self.assertTrue(serializer.is_valid())

        comment_with_reply_instance = serializer.save(user=self.user)

        self.assertIsInstance(comment_with_reply_instance, Comment)
        self.assertEqual(comment_with_reply_instance.post, self.post)
        self.assertEqual(comment_with_reply_instance.user, self.user)
        self.assertEqual(
            comment_with_reply_instance.content, self.expected_data_reply["content"]
        )
        self.assertIsNotNone(comment_with_reply_instance.date_created)
        self.assertEqual(comment_with_reply_instance.parent, self.raw_comment)

    def test_reply_deserialization_invalid_data_case(self):
        # invalid post
        invalid_data = {
            "post": 123,
            "content": "this is a reply",
            "parent": self.raw_comment.id,
        }

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(len(serializer.errors), 2)
        self.assertIn("parent", serializer.errors)
        self.assertIn("post", serializer.errors)

        # invalid parent
        invalid_data = {
            "post": self.post.id,
            "content": "I'm a valid content",
            "parent": 123,
        }

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("parent", serializer.errors)

        # TEST: validate_parent (valid: post, valid: parent. Not from the same post tho.)
        another_post = Post.objects.create(user=self.user, content="Another content")

        invalid_data = {
            "post": another_post.id,
            "content": "I'm a valid content",
            "parent": self.raw_comment,
        }

        serializer = CommentSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("parent", serializer.errors)

    def test_comment_serialization(self):
        serializer = CommentSerializer(instance=self.raw_comment)

        # serialized data
        serialized_data = serializer.data

        self.assertEqual(len(serialized_data), 8)
        self.assertIn("id", serialized_data)
        self.assertEqual(serialized_data["post"], self.raw_comment.post.id)
        self.assertEqual(serialized_data["user"]["id"], self.raw_comment.user.id)
        self.assertEqual(serialized_data["content"], self.raw_comment.content)
        self.assertIsNotNone(serialized_data["date_created"])
        self.assertIsNone(serialized_data["parent"])
        self.assertEqual(serialized_data["replies_count"], 0)
        self.assertFalse(serialized_data["is_liked"])

    def test_reply_serialization(self):
        reply_instance = Comment.objects.create(
            post=self.post,
            user=self.user,
            content="Im a reply",
            parent=self.raw_comment,
        )

        serializer = CommentSerializer(instance=reply_instance)

        # serialized data
        serialized_data = serializer.data

        self.assertEqual(len(serialized_data), 8)
        self.assertIn("id", serialized_data)
        self.assertEqual(serialized_data["post"], reply_instance.post.id)
        self.assertEqual(serialized_data["user"]["id"], reply_instance.user.id)
        self.assertEqual(serialized_data["content"], reply_instance.content)
        self.assertIsNotNone(serialized_data["date_created"])
        self.assertEqual(serialized_data["parent"], reply_instance.parent.id)
        self.assertEqual(serialized_data["replies_count"], 0)
        self.assertFalse(serialized_data["is_liked"])

    def test_comment_serialization_user_serializer(self):
        serializer = CommentSerializer(instance=self.raw_comment)

        # serialized data
        serialized_data = serializer.data

        # serialized user
        serialized_user = UserListSerializer(instance=self.raw_comment.user)

        self.assertEqual(serialized_data["user"], serialized_user.data)


class TestPostLikeSerializer(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="user@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="User",
        )
        self.post = Post.objects.create(user=self.user, content="This is a content")

        self.valid_data = {"post": self.post.id}

    def test_deserialization_valid_data(self):
        serializer = PostLikeSerializer(data=self.valid_data)

        self.assertTrue(serializer.is_valid())

        # deserialized instance
        post_like_instance = serializer.save(user=self.user)

        self.assertIsInstance(post_like_instance, PostLike)
        self.assertEqual(post_like_instance.post, self.post)
        self.assertEqual(post_like_instance.user, self.user)

    def test_deserialization_invalid_data(self):
        # no data
        invalid_data = {}

        serializer = PostLikeSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("post", serializer.errors)

        # wrong post
        invalid_data = {"post": 123}

        serializer = PostLikeSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())

        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("post", serializer.errors)

    def test_serialization_single(self):
        raw_post_like = PostLike.objects.create(post=self.post, user=self.user)

        serializer = PostLikeSerializer(instance=raw_post_like)

        # getting serialized data
        serialized_data = serializer.data

        self.assertEqual(serialized_data["post"], raw_post_like.post.id)
        self.assertEqual(serialized_data["user"]["id"], raw_post_like.user.id)

    def test_serialization_multiple(self):
        # Creating users
        user1 = CustomUser.objects.create_user(
            email="user1@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )
        user2 = CustomUser.objects.create_user(
            email="user2@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )
        user3 = CustomUser.objects.create_user(
            email="user3@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )

        # Creating Likes
        PostLike.objects.create(post=self.post, user=user1)
        PostLike.objects.create(post=self.post, user=user2)
        PostLike.objects.create(post=self.post, user=user3)

        # Making the queryset
        queryset = PostLike.objects.all()

        # serialization of queryset
        serializer = PostLikeSerializer(instance=queryset, many=True)

        # data
        serialized_data = serializer.data

        self.assertEqual(len(serialized_data), 3)

    def test_serialization_user_serialization(self):
        raw_post_like = PostLike.objects.create(post=self.post, user=self.user)

        serializer = PostLikeSerializer(instance=raw_post_like)

        # getting serialized data
        serialized_data = serializer.data

        # user serializer
        user_serializer = UserListSerializer(instance=raw_post_like.user)

        self.assertEqual(serialized_data["user"], user_serializer.data)


class TestCommentLikeSerializer(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="user@site.com",
            password="testpassword",
            first_name="User",
            last_name="Object",
        )
        self.post = Post.objects.create(user=self.user, content="This is a content")
        self.comment = Comment.objects.create(
            post=self.post, user=self.user, content="This is a comment."
        )

    def test_deserialization_valid_data(self):
        valid_data = {"comment": self.comment.id}
        serializer = CommentLikeSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        comment_like_instance = serializer.save(user=self.user)

        self.assertIsInstance(comment_like_instance, CommentLike)
        self.assertEqual(comment_like_instance.comment, self.comment)
        self.assertEqual(comment_like_instance.user, self.user)

    def test_deserialization_invalid_data(self):
        # no comment
        invalid_data = {}
        serializer = CommentLikeSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("comment", serializer.errors)

        # wrong comment
        invalid_data = {"comment": 123}
        serializer = CommentLikeSerializer(data=invalid_data)

        self.assertFalse(serializer.is_valid())
        self.assertEqual(len(serializer.errors), 1)
        self.assertIn("comment", serializer.errors)

    def test_serialization_single(self):
        raw_model_instance = CommentLike.objects.create(
            comment=self.comment, user=self.user
        )

        serializer = CommentLikeSerializer(instance=raw_model_instance)

        serialized_data = serializer.data

        self.assertEqual(serialized_data["comment"], self.comment.id)
        self.assertEqual(serialized_data["user"]["id"], self.user.id)

    def test_serialization_multiple(self):
        # Creating users
        user1 = CustomUser.objects.create_user(
            email="user1@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )
        user2 = CustomUser.objects.create_user(
            email="user2@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )
        user3 = CustomUser.objects.create_user(
            email="user3@site.com",
            password="testpassword",
            first_name="Testing",
            last_name="Testing",
        )

        # Creating Likes
        CommentLike.objects.create(comment=self.comment, user=user1)
        CommentLike.objects.create(comment=self.comment, user=user2)
        CommentLike.objects.create(comment=self.comment, user=user3)

        # Making the queryset
        queryset = CommentLike.objects.all()

        # serialization of queryset
        serializer = CommentLikeSerializer(instance=queryset, many=True)

        # data
        serialized_data = serializer.data

        self.assertEqual(len(serialized_data), 3)

    def test_serialization_user_serialization(self):
        raw_model_instance = CommentLike.objects.create(
            comment=self.comment, user=self.user
        )

        serializer = CommentLikeSerializer(instance=raw_model_instance)

        serialized_data = serializer.data

        serialized_user = UserListSerializer(instance=self.user)

        self.assertEqual(serialized_data["user"], serialized_user.data)
