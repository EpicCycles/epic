from django.http import Http404
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.model_serializers.framework_serializer import PartTypeSerializer
from epic.models.framework_models import PartType


class PartType(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = PartTypeSerializer

    def get_object(self, pk):
        try:
            return PartType.objects.get(pk=pk)
        except PartType.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer = PartTypeSerializer(self.get_object(pk))
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        serializer = PartTypeSerializer(self.get_object(pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = PartTypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        partType = self.get_object(pk)
        partType.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

