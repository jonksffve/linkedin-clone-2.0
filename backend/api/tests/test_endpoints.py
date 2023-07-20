from .test_setup import EndpointTestsSetup
from rest_framework import status


class TestAllAvailableEndpoints(EndpointTestsSetup):
    def test_accounts_endpoint(self):
        self.assertEqual(self.user_model.objects.count(), 0)
        # 400 bad request on ALL validations
        # No data
        response = self.client.post(self.endpoint_account, {})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 4)
        self.assertTrue(response.data["first_name"])
        self.assertTrue(response.data["last_name"])
        self.assertTrue(response.data["email"])
        self.assertTrue(response.data["password"])

        # No first_name
        response = self.client.post(
            self.endpoint_account,
            {
                "last_name": "User",
                "email": "test@user.com",
                "password": "1234567",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data["first_name"])

        # No last_name
        response = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "email": "test@user.com",
                "password": "1234567",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data["last_name"])

        # No email
        response = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "last_name": "User",
                "password": "1234567",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data["email"])

        # No password
        response = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "last_name": "User",
                "email": "test@user.com",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data["password"])

        # 200 Ok
        response = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "last_name": "User",
                "email": "test@user.com",
                "password": "1234567",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.user_model.objects.count(), 1)
        self.assertEqual(response.data["first_name"], "Testing")
        self.assertEqual(response.data["last_name"], "User")
        self.assertEqual(response.data["email"], "test@user.com")
        self.assertEqual(response.data["password"], "1234567")

        # taken email?
        response = self.client.post(
            self.endpoint_account,
            {
                "first_name": "Testing",
                "last_name": "User",
                "email": "test@user.com",
                "password": "1234567",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(len(response.data), 1)
        self.assertTrue(response.data["email"])
