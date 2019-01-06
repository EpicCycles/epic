from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.brand_serializer import BrandSerializer
from epic.models.brand_models import Brand


def create_brand(brand):
    serializer = BrandSerializer(data=brand)
    if serializer.is_valid():
        serializer.save()
        processed_brand = serializer.data
    else:
        brand['error'] = True
        brand['error_detail'] = serializer.errors
        processed_brand = brand
    return processed_brand


def save_existing_brand(brand, brand_id):
    existing_brand = Brand.objects.get(id=brand_id)
    if existing_brand is not None:
        serializer = BrandSerializer(instance=existing_brand, data=brand)
        if serializer.is_valid():
            serializer.save()
            return serializer.data
        else:
            brand['error'] = True
            brand['error_detail'] = serializer.errors
            return brand
    else:
        brand['id'] = ''
        brand['error'] = True
        return brand


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
            processed_brand = None
            brand_id = brand.get('id', None)
            if brand.get('delete', False) is True:
                if brand_id is not None:
                    Brand.objects.get(id=brand_id).delete()

            elif brand_id is None:
                processed_brand = create_brand(brand)
            else:
                processed_brand = save_existing_brand(brand, brand_id)
            if processed_brand:
                return_data.append(processed_brand)
                if processed_brand.get('error', False) is True:
                    errors = True

        if errors:
            return Response(return_data, status=status.HTTP_202_ACCEPTED)

        serializer = BrandSerializer(self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
