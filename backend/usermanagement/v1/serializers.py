from django.contrib.auth.models import User
from rest_framework import serializers

from common.helpers import error_messages
from usermanagement.v1.models import UserProfile


class UserProfileSerializer(serializers.Serializer):
    firstName = serializers.CharField(error_messages=error_messages())
    emailAddress = serializers.EmailField(error_messages=error_messages())
    password = serializers.CharField(error_messages=error_messages())

    def validate(self, data):
        email_address = data['emailAddress']
        password = data['password']
        validation_issues = {}
        instance = User.objects.filter(username=email_address)
        if instance:
            validation_issues.update(
                {"emailAddress": "The Email Address is already registered"})

        if len(password) < 8 or len(password) > 15:
            validation_issues.update({'password': "Password length should be between 8 and 15"})

        if validation_issues:
            raise serializers.ValidationError(validation_issues)

        return data

    def create(self, validated_data):
        first_name = validated_data['firstName']
        email_address = validated_data['emailAddress']
        password = validated_data['password']
        user_instance = User.objects.create_user(username=email_address, email=email_address,
                                                 password=password, first_name=first_name, is_active=True)

        profile_instance = UserProfile.objects.create(user=user_instance)
        return profile_instance

    class Meta:
        fields = ["firstName", "emailAddress", "password"]


class UserProfileLoginSerializer(serializers.Serializer):
    username = serializers.CharField(error_messages=error_messages())
    password = serializers.CharField(error_messages=error_messages())

    def validate(self, attrs):
        return attrs
