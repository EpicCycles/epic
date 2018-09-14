from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.framework_serializer import FrameworkSerializer
from epic.models import PartSection


class Framework(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameworkSerializer

    def get(self, request, format=None):
        """
        Returns a JSON response with a listing of course objects
        """
        partSections = PartSection.objects.all()
        serializer = FrameworkSerializer(partSections, many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = FrameworkSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
