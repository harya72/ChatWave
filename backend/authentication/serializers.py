from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ("username", "password", "email", "first_name", "last_name")

    def validate_password(self, value):
        # Validate password using Django's built-in password validation
        validate_password(value)
        return value

    def create(self, validate_data):
        user = User.objects.create_user(**validate_data)
        return user
