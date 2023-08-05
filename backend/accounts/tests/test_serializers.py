from django.test import TestCase
from ..serializers import (
    UserCreationSerializer,
    UserListSerializer,
    UserUpdateSerializer,
)
from ..models import CustomUser
from rest_framework.request import Request


class TestUserCreationSerializer(TestCase):
    def test_deserialization_valid_data(self):
        valid_data = {
            "first_name": "Jonathan",
            "last_name": "Ramirez",
            "email": "test@site.com",
            "password": "testpassword",
        }

        serializer = UserCreationSerializer(data=valid_data)

        self.assertTrue(serializer.is_valid())

        user_instance = serializer.save()

        self.assertIsInstance(user_instance, CustomUser)
        self.assertEqual(user_instance.username, None)
        self.assertEqual(user_instance.first_name, "Jonathan")
        self.assertEqual(user_instance.last_name, "Ramirez")
        self.assertEqual(user_instance.email, "test@site.com")
        self.assertIsNotNone(user_instance.avatar, None)
        self.assertIsNotNone(user_instance.banner, None)
        self.assertEqual(user_instance.title, "")
        self.assertEqual(user_instance.description, "")
        # test hashing password
        self.assertNotEqual(user_instance.password, valid_data["password"])

    def test_deserialization_invalid_data(self):
        invalid_data = [
            # no data
            {},
            # no first_name
            {"last_name": "User", "email": "user@site.com", "password": "1234test"},
            # no last_name
            {"first_name": "Testing", "email": "user@site.com", "password": "1234test"},
            # no email
            {"first_name": "Testing", "last_name": "User", "password": "1234test"},
            # no password
            {"first_name": "Testing", "last_name": "User", "email": "user@site.com"},
        ]

        for data in invalid_data:
            serializer = UserCreationSerializer(data=data)
            self.assertFalse(serializer.is_valid())

    def test_serialization(self):
        user_instance = CustomUser.objects.create_user(
            email="testing@site.com",
            password="testpass",
            first_name="Testing",
            last_name="Serialization",
        )

        serializer = UserCreationSerializer(instance=user_instance)
        serialized_obj = serializer.data

        self.assertEqual(len(serialized_obj), 4)
        self.assertEqual(serialized_obj["first_name"], user_instance.first_name)
        self.assertEqual(serialized_obj["last_name"], user_instance.last_name)
        self.assertEqual(serialized_obj["email"], user_instance.email)
        self.assertIsNotNone(serialized_obj["avatar"])
        self.assertNotIn("password", serialized_obj)


class TestUserListSerializer(TestCase):
    def test_serialization(self):
        raw_user_instance = CustomUser.objects.create_user(
            email="site@user.com",
            password="123test",
            first_name="Test",
            last_name="User",
        )

        serializer = UserListSerializer(instance=raw_user_instance)

        # serialized data
        serialized_data = serializer.data

        # all the fields
        self.assertTrue(len(serialized_data), 12)
        self.assertIn("id", serialized_data)
        self.assertIn("first_name", serialized_data)
        self.assertIn("last_name", serialized_data)
        self.assertIn("email", serialized_data)
        self.assertIn("avatar", serialized_data)
        self.assertIn("banner", serialized_data)
        self.assertIn("title", serialized_data)
        self.assertIn("description", serialized_data)
        self.assertIn("name", serialized_data)
        self.assertIn("get_followers", serialized_data)
        self.assertIn("get_following", serialized_data)
        self.assertIn("get_posts", serialized_data)

        # get_name works
        self.assertEqual(serialized_data["name"], "Test User")

        # field values
        self.assertEqual(serialized_data["email"], raw_user_instance.email)
        self.assertEqual(serialized_data["get_followers"], 0)
        self.assertEqual(serialized_data["get_following"], 0)
        self.assertEqual(serialized_data["get_posts"], 0)


class TestUserUpdateSerializer(TestCase):
    def setUp(self):
        self.user_obj = CustomUser.objects.create_user(
            email="email@site.com", password="test1234pass"
        )

        self.valid_data = {
            "first_name": "Updated First Name",
            "last_name": "Updated Last Name",
            "title": "Updated Title",
            "description": "Updated Description",
        }

    def test_update_valid_data_test_cases(self):
        self.assertEqual(self.user_obj.first_name, "")
        self.assertEqual(self.user_obj.last_name, "")
        self.assertEqual(self.user_obj.title, "")
        self.assertEqual(self.user_obj.description, "")

        serializer = UserUpdateSerializer(
            instance=self.user_obj,
            data=self.valid_data,
            partial=True,
        )
        self.assertTrue(serializer.is_valid())
        user_instance = serializer.save()
        self.assertEqual(user_instance.first_name, "Updated First Name")
        self.assertEqual(user_instance.last_name, "Updated Last Name")
        self.assertEqual(user_instance.title, "Updated Title")
        self.assertEqual(user_instance.description, "Updated Description")
