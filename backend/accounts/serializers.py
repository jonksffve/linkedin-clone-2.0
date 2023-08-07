from rest_framework import serializers
from .models import CustomUser


class UserCreationSerializer(serializers.ModelSerializer):
    """
    Serializer used for creation of CustomUser model instances
    """

    avatar = serializers.ImageField(required=False, allow_empty_file=True)
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        """
        Create a custom user object and properly hash the password
        """
        return CustomUser.objects.create_user(**validated_data)

    class Meta:
        model = CustomUser
        fields = ["first_name", "last_name", "email", "password", "avatar"]


class UserListSerializer(serializers.ModelSerializer):
    """
    Serializer used to retrieve information about a CustomUser model instance
    """

    name = serializers.SerializerMethodField(read_only=True)

    def get_name(self, obj):
        return obj.get_full_name()

    class Meta:
        model = CustomUser
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "avatar",
            "banner",
            "title",
            "description",
            "university",
            "actual_work",
            "location",
            "name",
            "get_followers",
            "get_following",
            "get_posts",
        ]


class UserInformationUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = [
            "first_name",
            "last_name",
            "title",
            "description",
            "university",
            "actual_work",
            "location",
        ]

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get("first_name", instance.first_name)
        instance.last_name = validated_data.get("last_name", instance.last_name)
        instance.title = validated_data.get("title", instance.title)
        instance.description = validated_data.get("description", instance.description)
        instance.university = validated_data.get("university", instance.university)
        instance.actual_work = validated_data.get("actual_work", instance.actual_work)
        instance.location = validated_data.get("location", instance.location)
        instance.save()
        return instance
