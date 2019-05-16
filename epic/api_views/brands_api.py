from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.http import Http404

from epic.model_serializers.brand_serializer import BrandSerializer
from epic.models.brand_models import Brand


class Brands(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BrandSerializer

    def get_queryset(self):
        return Brand.objects.all()

    def get(self, request, pk=None, format=None):
        serializer = BrandSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def post(self, request, pk=None, format=None):

        post_data = request.data
        return_data = []
        errors = False
        for brand in post_data:
            brand_id = brand.get('id', None)
            if brand_id is not None:
                existing_brand = Brand.objects.get(id=brand_id)
            if brand.get('delete', False) is True:
                existing_brand.delete()

            else:
                serializer = BrandSerializer(existing_brand, data=brand)
                if serializer.is_valid():
                    serializer.save()
                    return_data.append(serializer.data)
                else:
                    errors = True
                    brand['error'] = True
                    brand['error_detail'] = serializer.errors
                    return_data.append(brand)

        if errors:
            return Response(return_data, status=status.HTTP_202_ACCEPTED)

        serializer = BrandSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class BrandMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = BrandSerializer

    def get_object(self, pk):
        try:
            return Brand.objects.get(pk=pk)
        except Brand.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        brand = self.get_object(pk)
        serializer = BrandSerializer(brand)
        return Response(serializer.data)

    def post(self, request, pk):
        brand = self.get_object(pk)
        serializer = BrandSerializer(initial=brand, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        brand = self.get_object(pk)
        customer_id = brand.customer.id
        brand.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
