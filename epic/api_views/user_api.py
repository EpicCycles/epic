from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

# get the user related to the current session
from epic.model_serializers.user_serializer import UserSerializer


class UserMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def patch(self, request, username):
        user = request.user
        serializer = UserSerializer(data=request.data)
        return Response(serializer.data)
