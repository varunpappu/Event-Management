from functools import wraps
from uuid import UUID

from rest_framework import serializers
from rest_framework.response import Response

from usermanagement.v1.models import UserProfile


def has_valid_uuid():
    def request_decorator(dispatch):
        @wraps(dispatch)
        def wrapper(request, *args, **kwargs):
            try:
                UUID(kwargs.get("_id"), version=4)
                return dispatch(request, *args, **kwargs)
            except ValueError:
                raise serializers.ValidationError(code="invalid_uuid")

        return wrapper

    return request_decorator


def error_messages():
    return {'required': 'This field is required.',
            'blank': "This field is required.",
            'null': "This field is required.",
            'invalid': 'A valid value is required.'}


def response_builder(status, code, data):
    response = {
        "status": status,
        "details": data,
        "code": code,
    }
    return Response(response, content_type='application/json', status=status)


def check_valid_uuid(uuid):
    try:
        UUID(uuid, version=4)
        return True
    except ValueError:
        return False


def get_user_id(request_token):
    try:
        user_profile_instance = UserProfile.objects.get(user_id=request_token.user.id)
        return user_profile_instance
    except UserProfile.DoesNotExist as e:
        raise serializers.ValidationError({'detail': "Authentication credentials were not provided."})
