from rest_framework import serializers
from .models import CustomUser


class UserCreationSerializer(serializers.ModelSerializer):
    """
    Serializer used for creation of CustomUser model instances
    """

    def create(self, validated_data):
        """
        Create a custom user object and properly hash the password
        """
        user = CustomUser.objects.create_user(**validated_data)
        return user

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "password", "avatar"]


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer used to retrieve information about a CustomUser model instance
    """

    name = serializers.SerializerMethodField()

    def get_name(self, obj):
        return obj.get_full_name()

    class Meta:
        model = CustomUser
        fields = ["id", "name", "email", "avatar"]
