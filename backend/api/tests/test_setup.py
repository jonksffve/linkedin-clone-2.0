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
