from django.test import TestCase
from accounts.models import CustomUser, UserFollows
from django.db import IntegrityError


class CustomUserModelTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            email="normal@user.com",
            password="textpassword",
            first_name="Testing",
            last_name="Users",
            title="Software Engineer",
            description="Im a Software Engineer living in Madrid",
        )

    def test_user_model_fields(self):
        self.assertIsNone(self.user.username)
        self.assertEqual(self.user.first_name, "Testing")
        self.assertEqual(self.user.last_name, "Users")
        self.assertEqual(self.user.email, "normal@user.com")
        # make sure it pre-populated with default
        self.assertIsNotNone(self.user.avatar)
        # make sure it pre-populated with default
        self.assertIsNotNone(self.user.banner)
        self.assertEqual(self.user.title, "Software Engineer")
        self.assertEqual(
            self.user.description, "Im a Software Engineer living in Madrid"
        )

    def test_user_model_methods(self):
        self.assertEqual(self.user.get_full_name(), "Testing Users")
        self.assertEqual(self.user.get_short_name(), "Testing")

    def test_user_model_properties(self):
        self.assertEqual(self.user.get_followers, 0)
        self.assertEqual(self.user.get_following, 0)
        self.assertEqual(self.user.get_posts, 0)

    def test_user_model_clean_method(self):
        # Test the clean method normalization of the email (it only normalizes the domain)
        email = "JoHn.Doe@EXAMPLE.COM"
        user = CustomUser(first_name="John", last_name="Doe", email=email)
        user.clean()
        self.assertEqual(user.email, "JoHn.Doe@example.com")

    def test_user_model_str_representation(self):
        self.assertEqual(str(self.user), "normal@user.com")


class CustomUserManagerTest(TestCase):
    def setUp(self):
        CustomUser.objects.create_user(email="user@site.com", password="testpassword")

    def test_create_user(self):
        # Test creating a regular user

        user = CustomUser.objects.create_user(
            email="testuser@example.com", password="testpassword"
        )
        self.assertIsInstance(user, CustomUser)
        self.assertEqual(user.email, "testuser@example.com")
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        # Test creating a superuser

        superuser = CustomUser.objects.create_superuser(
            email="admin@example.com", password="adminpassword"
        )
        self.assertIsInstance(superuser, CustomUser)
        self.assertEqual(superuser.email, "admin@example.com")
        self.assertTrue(superuser.is_active)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

    def test_create_superuser_invalid_flags(self):
        # Test that trying to create a superuser with invalid flags raises an error

        with self.assertRaises(ValueError) as context_manager:
            CustomUser.objects.create_superuser(
                email="admin@example.com", password="adminpassword", is_staff=False
            )

        self.assertEqual(
            str(context_manager.exception), "Superuser must have is_staff=True."
        )

        with self.assertRaises(ValueError) as context_manager:
            CustomUser.objects.create_superuser(
                email="admin@example.com", password="adminpassword", is_superuser=False
            )

        self.assertEqual(
            str(context_manager.exception), "Superuser must have is_superuser=True."
        )

    def test_create_user_invalid_flags(self):
        with self.assertRaises(TypeError):
            CustomUser.objects.create_user()
        with self.assertRaises(TypeError):
            CustomUser.objects.create_user(email="")
        with self.assertRaises(ValueError):
            CustomUser.objects.create_user(email="", password="foo")
        with self.assertRaises(IntegrityError):
            CustomUser.objects.create_user(
                email="user@site.com",
                password="foo",
                first_name="Prueba",
                last_name="Santos",
            )


class UserFollowsModelTest(TestCase):
    @classmethod
    def setUpTestData(cls):
        # Make sure we have FK relationships before testing
        cls.user_one = CustomUser.objects.create_user(
            first_name="User",
            last_name="One",
            email="user.one@email.com",
            password="password",
        )

        cls.user_target = CustomUser.objects.create_user(
            first_name="User",
            last_name="Two",
            email="user.two@email.com",
            password="password",
        )

        cls.user_follows = UserFollows.objects.create(
            user=cls.user_one, target_user=cls.user_target
        )

    def test_user_follows_model_fields(self):
        # Testing required fields (non prepopulated)
        self.assertEqual(self.user_follows.user, self.user_one)
        self.assertEqual(self.user_follows.target_user, self.user_target)

    def test_user_follows_model_date_added(self):
        # Testing automatic adding date
        self.assertIsNotNone(self.user_follows.date_added)

    def test_user_follows_model_str_representation(self):
        # Testing str representation
        expected_str = f"{self.user_one} follows {self.user_target}"
        self.assertEqual(str(self.user_follows), expected_str)

    def test_user_follows_model_follow_relationships(self):
        self.assertEqual(self.user_one.followers.count(), 0)
        self.assertEqual(self.user_one.following.count(), 1)
        self.assertEqual(self.user_target.followers.count(), 1)
        self.assertEqual(self.user_target.following.count(), 0)

    def test_user_follows_model_unique_constraint(self):
        # Testing uniqueness constraint
        with self.assertRaises(Exception) as thrown_error:
            UserFollows.objects.create(user=self.user_one, target_user=self.user_target)

        self.assertIsInstance(thrown_error.exception, IntegrityError)
