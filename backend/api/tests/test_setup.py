from rest_framework.test import APITestCase, APIClient
from django.contrib.auth import get_user_model


class EndpointTestsSetup(APITestCase):
    """
    Basic setUp for testing API endpoints
    """

    def setUp(self):
        # Test client
        self.client = APIClient()

        # Current CustomUser model
        self.user_model = get_user_model()

        # Different endpoints
        self.endpoint_account = "/api/account/"
        self.endpoint_login = "/api/login/"

        # User object to work with
        self.user_object = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "last_name": "User",
                "email": "testuser@email.com",
                "password": "1234567",
            },
            format="json",
        ).data
