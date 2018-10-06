from django.http import Http404
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.model_serializers.framework_serializer import SectionSerializer
from epic.models import PartSection


class PartSection(generics.GenericAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    serializer_class = SectionSerializer

    def get_object(self, pk):
        try:
            return PartSection.objects.get(pk=pk)
        except PartSection.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        serializer = SectionSerializer(self.get_object(pk))
        return Response(serializer.data)

    def patch(self, request, pk, format=None):
        serializer = SectionSerializer(self.get_object(pk), data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, format=None):
        serializer = SectionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        section = self.get_object(pk)
        section.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

