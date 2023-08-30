from rest_framework.test import APITestCase
from rest_framework import status

from django.urls import reverse
from django.db import IntegrityError
from django.core.files.uploadedfile import SimpleUploadedFile

from accounts.models import CustomUser

from feed.models import Post, PostLike, Comment, CommentLike


class UserCreationViewTest(APITestCase):
    """
    Test cases for User model creation view

    Returns:
        - 201 Created: with a serialized representation of the user object
        - 400 Bad request: if ValidationError was raised or IntegrityError
    """

    def setUp(self):
        self.url = reverse("register")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )

    def test_create_user_valid_data(self):
        data = {
            "email": "test@example.com",
            "password": "testpassword",
            "first_name": "Testing",
            "last_name": "User DRF",
        }

        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data["email"], "test@example.com")
        self.assertNotIn("password", response.data)

    def test_create_user_invalid_data(self):
        # Test case where invalid data causes a ValidationError (no data)
        invalid_data = {}
        response = self.client.post(self.url, invalid_data, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 4)
        self.assertIn("first_name", response.data)
        self.assertIn("last_name", response.data)
        self.assertIn("email", response.data)
        self.assertIn("password", response.data)

        # Test case where invalid data causes a ValidationError (no first_name)
        invalid_data = {
            "last_name": "User",
            "email": "test@user.com",
            "password": "1234567",
        }
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("first_name", response.data)

        # Test case where invalid data causes a ValidationError (no last_name)
        invalid_data = {
            "first_name": "Testing",
            "email": "test@user.com",
            "password": "1234567",
        }
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("last_name", response.data)

        # Test case where invalid data causes a ValidationError (no email)
        invalid_data = {
            "first_name": "Testing",
            "last_name": "User",
            "password": "1234567",
        }
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("email", response.data)

        # Test case where invalid data causes a ValidationError (no password)
        invalid_data = {
            "first_name": "Testing",
            "last_name": "User",
            "email": "test@user.com",
        }
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("password", response.data)

        # Test case where invalid data causes a IntegrityError (same email)
        invalid_data = {
            "first_name": "Testing",
            "last_name": "User",
            "email": "testuser@site.com",
            "password": "1234567",
        }
        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("email", response.data)


class LoginViewTest(APITestCase):
    """
    Test cases for Token authorization retrieve

    Returns:
        - 200 Ok: with a serialized representation that includes token, expiry, user
        - 400 Bad request: when ValidationError thrown or user could not be found in db
    """

    def setUp(self):
        self.url = reverse("login")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )

    def test_can_login_valid_data(self):
        data = {"username": "testuser@site.com", "password": "testpass"}

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertIn("token", response.data)
        self.assertIn("user", response.data)
        self.assertIn("expiry", response.data)

    def test_can_not_login_invalid_data(self):
        # no matching data
        invalid_data = {"username": "testuser@site.com", "password": "testPASS"}

        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # no data
        invalid_data = {}

        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # missing email
        invalid_data = {"password": "testPASS"}

        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

        # missing password
        invalid_data = {"username": "testuser@site.com"}

        response = self.client.post(self.url, invalid_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserRetrieveViewTest(APITestCase):
    """
    Test cases for User model Retrieve view

    Returns:
        - 200 Ok: with a serialized representation of the user object
        - 401 Unauthorized: When user didn't provide valid authorization
        - 404 Not found: When failed to lookup user information with given email
    """

    def setUp(self):
        self.url = reverse("profile")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.other_user = CustomUser.objects.create_user(
            email="testuser2@site.com",
            password="testpass",
            first_name="Testing 2",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]

    def test_can_retrieve_own_information(self):
        response = self.client.get(
            self.url,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_can_retrieve_other_information(self):
        response = self.client.get(
            f"{self.url}?email={self.other_user.email}",
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], self.other_user.email)

    def test_can_not_retrieve_information(self):
        # wrong data
        response = self.client.get(
            f"{self.url}?email=idontexist@site.com",
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_retrieve_information(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserUpdateViewTest(APITestCase):
    """
    Test cases for updating customuser model instances information
    """

    def setUp(self):
        self.url = reverse("profile-update")
        self.user_instance = CustomUser.objects.create_user(
            email="user@site.com", password="test123"
        )
        self.another_user_instance = CustomUser.objects.create_user(
            email="user1@site.com", password="test123"
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "user@site.com", "password": "test123"},
            format="json",
        ).data["token"]

    # 200ok
    def test_can_update_user_valid_data(self):
        valid_data = {
            "first_name": "New first name",
            "last_name": "New last name",
            "title": "Now i have title",
            "description": "This is my description",
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 401unathorized
    def test_can_not_update_user_unauthorized(self):
        valid_data = {
            "first_name": "New first name",
            "last_name": "New last name",
            "title": "Now i have title",
            "description": "This is my description",
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserUpdateAvatarViewTest(APITestCase):
    """
    Test cases for updating customuser model instances avatar
    """

    def setUp(self):
        self.url = reverse("profile-avatar-update")
        self.user_instance = CustomUser.objects.create_user(
            email="user@site.com", password="test123"
        )
        self.another_user_instance = CustomUser.objects.create_user(
            email="user1@site.com", password="test123"
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "user@site.com", "password": "test123"},
            format="json",
        ).data["token"]

    # 200ok
    def test_can_update_avatar_valid_data(self):
        valid_data = {
            "avatar": SimpleUploadedFile(
                name="test_updated_image.jpg",
                content=open("media/test_files/updated_avatar.jfif", "rb").read(),
                content_type="image/jpeg",
            )
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="multipart",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 401unathorized
    def test_can_not_update_user_unauthorized(self):
        valid_data = {
            "avatar": SimpleUploadedFile(
                name="test_updated_image.jpg",
                content=open("media/test_files/updated_avatar.jfif", "rb").read(),
                content_type="image/jpeg",
            )
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserUpdateBannerViewTest(APITestCase):
    """
    Test cases for updating customuser model instances banner
    """

    def setUp(self):
        self.url = reverse("profile-banner-update")
        self.user_instance = CustomUser.objects.create_user(
            email="user@site.com", password="test123"
        )
        self.another_user_instance = CustomUser.objects.create_user(
            email="user1@site.com", password="test123"
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "user@site.com", "password": "test123"},
            format="json",
        ).data["token"]

    # 200ok
    def test_can_update_avatar_valid_data(self):
        valid_data = {
            "banner": SimpleUploadedFile(
                name="test_updated_image.jpg",
                content=open("media/test_files/updated_banner.jfif", "rb").read(),
                content_type="image/jpeg",
            )
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="multipart",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    # 401unathorized
    def test_can_not_update_user_unauthorized(self):
        valid_data = {
            "banner": SimpleUploadedFile(
                name="test_updated_image.jpg",
                content=open("media/test_files/updated_banner.jfif", "rb").read(),
                content_type="image/jpeg",
            )
        }

        response = self.client.patch(
            self.url,
            data=valid_data,
            format="multipart",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostListCreateViewTest(APITestCase):
    """
    Test cases for Post model List/Create view

    Returns:
        - 200 Ok: with a serialized representation of the queryset
        - 201 Created: with a serialized representation of the post model object
        - 400 Bad request: when raised ValidationError
        - 401 Unauthorized: when failed to provided valid authentication
    """

    def setUp(self):
        self.url = reverse("post-list-create")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]

    def test_can_get_list_posts(self):
        # Create some posts in order to list them
        Post.objects.create(user=self.user, content="Test content")
        Post.objects.create(user=self.user, content="Test content")
        Post.objects.create(user=self.user, content="Test content")
        Post.objects.create(user=self.user, content="Test content")

        response = self.client.get(
            self.url,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_can_create_post_valid_data(self):
        data = {"content": "Creation via DRF"}

        response = self.client.post(
            self.url,
            data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 8)
        self.assertIn("id", response.data)
        self.assertIn("user", response.data)
        self.assertIn("content", response.data)
        self.assertIn("date_created", response.data)
        self.assertIn("file", response.data)
        self.assertIn("is_liked", response.data)
        self.assertIn("get_comments", response.data)
        self.assertIn("get_likes", response.data)
        self.assertIsNotNone(response.data["date_created"])
        self.assertIsNone(response.data["file"])

    def test_can_not_create_post_invalid_data(self):
        # no data
        invalid_data = {}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("content", response.data)

    def test_unauthorized_access(self):
        response = self.client.get(self.url, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        data = {"content": "Creation via DRF"}
        response = self.client.post(
            self.url,
            data,
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostLikeCreateViewTest(APITestCase):
    """
    Test cases for PostLike model CreateView

    Returns:
        - 201 Created: with a serialized representation of the PostLike model object
        - 400 Bad Request: when raised ValidationError, IntegrityError
        - 401 Unauthorized: when failed to provide valid authorization
    """

    def setUp(self):
        self.url = reverse("post-like-create")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]
        self.post = Post.objects.create(user=self.user, content="This is a content")

    def test_can_create_like_valid_data(self):
        data = {"post": self.post.id}
        response = self.client.post(
            self.url, data, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 2)
        self.assertIn("user", response.data)
        self.assertIn("post", response.data)

    def test_can_not_create_like_invalid_data(self):
        # no data
        invalid_data = {}
        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("post", response.data)

        # wrong id
        invalid_data = {"post": "kadosa1"}
        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("post", response.data)

        # Can't like it twice
        PostLike.objects.create(post=self.post, user=self.user)
        data = {"post": self.post.id}
        with self.assertRaises(Exception) as thrown_error:
            self.client.post(
                self.url, data, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
            )
        self.assertIsInstance(thrown_error.exception, IntegrityError)

    def test_unauthorized_access(self):
        data = {"post": self.post.id}

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PostLikeDestroyViewTest(APITestCase):
    """
    Test cases for PostLike model instances Destroy view

    Returns:
        - 204 No Content: if an object was deleted
        - 401 Unathorized: when failed to provided valid authentication
        - 404 Not Found: object to be deleted was not found or was not liked by user (based on queryset)
    """

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.another_user = CustomUser.objects.create_user(
            email="testuser1@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]
        self.post = Post.objects.create(user=self.user, content="This is a content")

    def test_can_destroy_like_valid_action(self):
        PostLike.objects.create(post=self.post, user=self.user)

        response = self.client.delete(
            reverse("post-like-destroy", kwargs={"post": self.post.id}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_can_not_destroy_list_invalid_action(self):
        PostLike.objects.create(post=self.post, user=self.user)

        # not found
        response = self.client.delete(
            reverse("post-like-destroy", kwargs={"post": "13165asd"}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # not owner
        another_post = PostLike.objects.create(post=self.post, user=self.another_user)
        response = self.client.delete(
            reverse("post-like-destroy", kwargs={"post": another_post.id}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_unauthorized_access(self):
        response = self.client.delete(
            reverse("post-like-destroy", kwargs={"post": self.post.id}),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentListCreateViewTest(APITestCase):
    """
    Test cases for Comment model instances CREATION or LIST

    Returns:
        - 200 Ok: with serialized representation of the Comments queryset
        - 201 Created: with a serialized representation of the Comment object
        - 400 Bad Request: when raised ValidationError/ValueError
        - 401 Unauthorized: when failed to provide valid authentication
    """

    def setUp(self):
        self.url = reverse("comment-list-create")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]
        self.post = Post.objects.create(user=self.user, content="This is a content")

    def test_can_list_main_comments(self):
        # We need some comments
        Comment.objects.create(
            post=self.post, user=self.user, content="Hello this is comment #1"
        )
        Comment.objects.create(
            post=self.post, user=self.user, content="Hello this is comment #2"
        )
        Comment.objects.create(
            post=self.post, user=self.user, content="Hello this is comment #3"
        )
        Comment.objects.create(
            post=self.post, user=self.user, content="Hello this is comment #4"
        )

        response = self.client.get(
            f"{self.url}?post_id={self.post.id}",
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)

    def test_can_list_replies_comment(self):
        # we need a main comment
        main_comment = Comment.objects.create(
            post=self.post, user=self.user, content="Hello this is 1 comment"
        )
        # we need replies on this comment
        Comment.objects.create(
            post=self.post,
            user=self.user,
            content="Hello this is reply #1",
            parent=main_comment,
        )
        Comment.objects.create(
            post=self.post,
            user=self.user,
            content="Hello this is reply #2",
            parent=main_comment,
        )
        Comment.objects.create(
            post=self.post,
            user=self.user,
            content="Hello this is reply #3",
            parent=main_comment,
        )

        response = self.client.get(
            f"{self.url}?parent_id={main_comment.id}",
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # 3 replies
        self.assertEqual(len(response.data), 3)

    def test_list_no_query_params(self):
        response = self.client.get(
            self.url, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_can_create_comment_valid_data(self):
        data = {"post": self.post.id, "content": "This is my first comment"}

        response = self.client.post(
            self.url, data, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 8)
        self.assertIn("id", response.data)
        self.assertIn("post", response.data)
        self.assertIn("user", response.data)
        self.assertIn("content", response.data)
        self.assertIsNotNone("date_created", response.data)
        self.assertIn("parent", response.data)
        self.assertIn("replies_count", response.data)
        self.assertIn("is_liked", response.data)
        self.assertIsNone(response.data["parent"])

    def test_can_create_reply_valid_data(self):
        # Create a comment to reply
        main_comment = Comment.objects.create(
            post=self.post, user=self.user, content="Test post"
        )

        data = {
            "post": self.post.id,
            "content": "This is my first reply",
            "parent": main_comment.id,
        }

        response = self.client.post(
            self.url, data, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 8)
        self.assertIn("id", response.data)
        self.assertIn("post", response.data)
        self.assertIn("user", response.data)
        self.assertIn("content", response.data)
        self.assertIsNotNone("date_created", response.data)
        self.assertIn("parent", response.data)
        self.assertIn("replies_count", response.data)
        self.assertIn("is_liked", response.data)
        self.assertEqual(response.data["parent"], main_comment.id)

    def test_can_not_create_comment_invalid_data(self):
        # no data
        invalid_data = {}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 2)
        self.assertIn("post", response.data)
        self.assertIn("content", response.data)

        # no post
        invalid_data = {"content": "I got no post"}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("post", response.data)

        # invalid post
        invalid_data = {"post": "123213", "content": "This post doesnt exist"}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("post", response.data)

        # no content
        invalid_data = {"post": self.post.id}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("content", response.data)

        # wrong parent
        invalid_data = {
            "post": self.post.id,
            "content": "This parent doesnt exist, like mine! huh!",
            "parent": "12312",
        }

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("parent", response.data)

    def test_unauthorized_access(self):
        data = {
            "post": self.post.id,
            "content": "we wild dog, we got no permissions",
        }

        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentLikeCreateViewTest(APITestCase):
    """
    Test cases form CommentLike model CreateView

    Returns:
        - 201 Created: with a serialized representation of the CommentLike object
        - 400 Bad Request: if ValidationError is raised
        - 401 Unauthorized: if we failed to provide valid authentication
    """

    def setUp(self):
        self.url = reverse("comment-like-create")
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]
        self.post = Post.objects.create(user=self.user, content="This is a content")
        self.comment = Comment.objects.create(
            post=self.post, user=self.user, content="This is a comment"
        )

    def test_can_like_comment_valid_data(self):
        data = {"comment": self.comment.id}

        response = self.client.post(
            self.url, data, format="json", HTTP_AUTHORIZATION=f"Token {self.token}"
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["comment"], self.comment.id)
        self.assertEqual(response.data["user"]["id"], self.user.id)

    def test_can_not_like_comment_invalid_data(self):
        # no comment
        invalid_data = {}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("comment", response.data)

        # comment does not exists
        invalid_data = {"comment": "idunkown"}

        response = self.client.post(
            self.url,
            invalid_data,
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertIn("comment", response.data)

        # integrity error
        # We like object
        CommentLike.objects.create(comment=self.comment, user=self.user)
        invalid_data = {"comment": self.comment.id}

        with self.assertRaises(Exception) as thrown_exception:
            self.client.post(
                self.url,
                invalid_data,
                format="json",
                HTTP_AUTHORIZATION=f"Token {self.token}",
            )

        self.assertIsInstance(thrown_exception.exception, IntegrityError)

    def test_unauthorized_access(self):
        data = {"comment": self.comment.id}
        response = self.client.post(self.url, data, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentLikeDestroyViewTest(APITestCase):
    """
    Test cases for CommentLike DestroyView

    Returns:
        - 204 No Content: when object is deleted
        - 401 Unauthorized: when failed to provide valid authentication
        - 404 Not Found: when failed to delete object
    """

    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="testuser@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.another_user = CustomUser.objects.create_user(
            email="testuser1@site.com",
            password="testpass",
            first_name="Testing",
            last_name="DRF",
        )
        self.token = self.client.post(
            reverse("login"),
            {"username": "testuser@site.com", "password": "testpass"},
            format="json",
        ).data["token"]
        self.post = Post.objects.create(user=self.user, content="This is a content")
        self.comment = Comment.objects.create(
            post=self.post, user=self.user, content="This is a comment"
        )

    def test_can_delete_comment_like(self):
        # Must be a comment like to delete
        CommentLike.objects.create(comment=self.comment, user=self.user)

        response = self.client.delete(
            reverse("comment-like-destroy", kwargs={"comment": self.comment.id}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_can_not_delete_comment_like(self):
        # Must be a comment like to delete
        CommentLike.objects.create(comment=self.comment, user=self.another_user)

        # wrong comment id
        response = self.client.delete(
            reverse("comment-like-destroy", kwargs={"comment": "wrongid"}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

        # not owner
        response = self.client.delete(
            reverse("comment-like-destroy", kwargs={"comment": self.comment.id}),
            format="json",
            HTTP_AUTHORIZATION=f"Token {self.token}",
        )
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(CommentLike.objects.count(), 1)

    def test_unauthorized_access(self):
        response = self.client.delete(
            reverse("comment-like-destroy", kwargs={"comment": "wrongid"}),
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
