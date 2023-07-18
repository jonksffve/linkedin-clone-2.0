from django.test import TestCase
from django.contrib.auth import get_user_model


class AccountsTestSetup(TestCase):
    def setUp(self):
        self.user_model = get_user_model()
