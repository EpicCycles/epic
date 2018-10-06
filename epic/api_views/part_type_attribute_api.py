from django.http import Http404
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.model_serializers.framework_serializer import PartTypeAttributeSerializer
from epic.models import PartTypeAttribute


class PartTypeAttribute(generics.GenericAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    serializer_class = PartTypeAttributeSerializer

    def get_object(self, pk):
        try:
            return PartTypeAttribute.objects.get(pk=pk)
        except PartTypeAttribute.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer = PartTypeAttributeSerializer(self.get_object(pk))
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        serializer = PartTypeAttributeSerializer(self.get_object(pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = PartTypeAttributeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        partTypeAttribute = self.get_object(pk)
        partTypeAttribute.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

