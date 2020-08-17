from rest_framework import status
from rest_framework.views import APIView

from common.helpers import response_builder
from usermanagement.v1.serializers import UserProfileSerializer


class CreateUserProfile(APIView):

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return response_builder(status.HTTP_201_CREATED, "SUCCESS", ["Successfully Created"])
