from rest_framework import serializers
from .models import CustomUser


class UserCreationSerializer(serializers.ModelSerializer):
    """
    Serializer used for creation of CustomUser model instances
    """

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "password", "avatar"]
