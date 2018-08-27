from django.contrib.admin.utils import lookup_field
from django.contrib.auth.models import User
from django.http import Http404
from rest_framework import generics
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.serializers import UserSerializer

# get the user related to the current session
class UserMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    lookup_field = 'username'

    def get(self, request, username, format=None):
        user = User.objects.get(username=username)
        serializer = UserSerializer(user)
        return Response(serializer.data)
