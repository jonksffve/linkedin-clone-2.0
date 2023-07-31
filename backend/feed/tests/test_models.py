from django.test import TestCase
from accounts.models import CustomUser
from feed.models import Post, Comment, PostLike, CommentLike
from django.db import IntegrityError
from django.core.files.uploadedfile import SimpleUploadedFile


class PostModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create an user for FK relationship
        cls.user = CustomUser.objects.create_user(
            email="test@user.com",
            first_name="Testing",
            last_name="Django",
            password="testpassword",
        )

        # Create a test Post without file
        cls.post = Post.objects.create(
            user=cls.user, content="This is just content for testing"
        )

    def test_can_create_post_with_file(self):
        with open("media/test_files/nerdy.jpg", "rb") as file:
            post = Post.objects.create(
                user=self.user,
                content="This post contains an image.",
                file=SimpleUploadedFile(file.name, file.read()),
            )

        self.assertNotEqual(post.file, None)

    def test_model_properties(self):
        self.assertEqual(self.post.get_comments_count, 0)
        self.assertEqual(self.post.get_likes_count, 0)

    def test_post_model_fields(self):
        # Test the fields of the Post model created without file
        self.assertEqual(self.post.user, self.user)
        self.assertEqual(self.post.content, "This is just content for testing")
        self.assertIsNotNone(self.post.date_created)
        self.assertEqual(self.post.file, None)

    def test_post_model_str_representation(self):
        # Test the string representation of the Post model
        expected_str = f"{self.user} posted - {self.post.date_created}"
        self.assertEqual(str(self.post), expected_str)

    # post likes
    def test_post_model_likes_count(self):
        self.assertEqual(self.post.likes.count(), 0)

    # post comments
    def test_post_model_comments_count(self):
        self.assertEqual(self.post.comments.count(), 0)


class CommentModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Creating model instances for FK relationships
        # user
        cls.user = CustomUser.objects.create_user(
            email="normal@user.com",
            password="textpassword",
            first_name="Testing",
            last_name="Django",
        )

        # post
        cls.post = Post.objects.create(user=cls.user, content="This is just a test")

        # Comment
        cls.comment = Comment.objects.create(
            post=cls.post, user=cls.user, content="First ever comment"
        )

    def test_comment_model_fields(self):
        self.assertEqual(self.comment.post, self.post)
        self.assertEqual(self.comment.user, self.user)
        self.assertEqual(self.comment.content, "First ever comment")
        self.assertEqual(self.comment.parent, None)

    def test_comment_model_date_created(self):
        self.assertIsNotNone(self.comment.date_created)

    def test_comment_model_str_representation(self):
        expected_str = f"{self.user} comment on: {self.post}"
        self.assertEqual(str(self.comment), expected_str)

    def test_comment_model_parent_relationship(self):
        parent_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content="This is a parent comment.",
        )
        reply_comment = Comment.objects.create(
            post=self.post,
            user=self.user,
            content="This is a reply comment.",
            parent=parent_comment,
        )

        # Check that the reply comment has the correct parent comment
        self.assertEqual(reply_comment.parent, parent_comment)

        # Check that the parent comment has the correct number of replies
        self.assertEqual(parent_comment.replies.count(), 1)
        self.assertEqual(parent_comment.replies.first(), reply_comment)

    def test_comment_model_ordering(self):
        # Test the ordering of the Comment model by date_created (descending)
        comments_ordered = Comment.objects.all().order_by("-date_created")
        self.assertQuerysetEqual(comments_ordered, Comment.objects.all(), ordered=True)

    def test_comment_model_likes_count(self):
        # Test initial count of likes
        self.assertEqual(self.comment.likes.count(), 0)


class PostLikeModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Create those FK relationships needed
        # user
        cls.user = CustomUser.objects.create_user(
            first_name="Testing",
            last_name="User",
            email="user@site.com",
            password="textpassword",
        )

        # post
        cls.post = Post.objects.create(user=cls.user, content="Test content")

        # Like instance
        cls.post_like = PostLike.objects.create(post=cls.post, user=cls.user)

    def test_post_like_model_fields(self):
        self.assertEqual(self.post_like.post, self.post)
        self.assertEqual(self.post_like.user, self.user)

    # date
    def test_post_like_model_date_like(self):
        self.assertIsNotNone(self.post_like.date_like)

    # str method
    def test_post_like_model_str_representation(self):
        expected_str = f"{self.user} liked: {self.post}"
        self.assertEqual(str(self.post_like), expected_str)

    # constraint
    def test_post_like_model_unique_constraint(self):
        # Attempt to create a duplicate like entry for the same post and user combination
        with self.assertRaises(Exception) as error_thrown:
            PostLike.objects.create(post=self.post, user=self.user)

        # Check if an IntegrityError was raised
        self.assertIsInstance(error_thrown.exception, IntegrityError)


class CommentLikeModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Make sure all FK relationships are available
        cls.user = CustomUser.objects.create_user(
            email="normal@user.com",
            password="textpassword",
            first_name="Test",
            last_name="Django",
        )

        cls.post = Post.objects.create(user=cls.user, content="Test content")

        cls.comment = Comment.objects.create(
            post=cls.post, user=cls.user, content="Test content"
        )

        cls.comment_like = CommentLike.objects.create(
            comment=cls.comment, user=cls.user
        )

    def test_comment_like_model_fields(self):
        # Make sure we test all fields
        self.assertEqual(self.comment_like.comment, self.comment)
        self.assertEqual(self.comment_like.user, self.user)

    def test_comment_like_model_date_added(self):
        # Make sure date is getting added automatically
        self.assertIsNotNone(self.comment_like.date_like)

    def test_comment_like_model_str_representation(self):
        # Make sure we getting the expected str
        expected_str = f"{self.user} liked comment: {self.comment}"
        self.assertEqual(str(self.comment_like), expected_str)

    def test_comment_like_model_unique_constraint(self):
        # Test for the uniqueness of the one like per user
        with self.assertRaises(Exception) as error_thrown:
            CommentLike.objects.create(comment=self.comment, user=self.user)

        self.assertIsInstance(error_thrown.exception, IntegrityError)
