from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.part_serializer import PartSerializer, SupplierProductSerializer, BundleSerializer
from epic.models.bike_models import BikePart
from epic.models.brand_models import Part, SupplierProduct, Bundle
from epic.models.quote_models import QuotePart


@api_view()
def parts_and_supplier_parts(request):
    q_parts = Part.objects.all()
    q_supplier_products = SupplierProduct.objects.all()

    # now get back filter params
    search_name = request.query_params.get('partName', None)
    search_brand = request.query_params.get('brand', None)
    include_standard = request.query_params.get('standard', None)
    include_stocked = request.query_params.get('stocked', None)
    supplier = request.query_params.get('supplier', None)

    # supplier provided need to double filter
    if supplier:
        q_supplier_products = q_supplier_products.filter(supplier__id=supplier)
        values = q_supplier_products.values_list('part__pk', flat=True)
        q_parts = q_parts.filter(pk__in=list(values))

    # filter parts
    if search_brand:
        q_parts = q_parts.filter(brand__id=search_brand)

    # if filter added on name add it to query set
    if search_name:
        q_parts = q_parts.filter(part_name__icontains=search_name)

    if include_standard == 'true':
        q_parts = q_parts.filter(standard=True)
    if include_stocked == 'true':
        q_parts = q_parts.filter(stocked=True)

    # now filter supplier parts based on remaining parts
    q_supplier_products = q_supplier_products.filter(part__in=q_parts)
    q_bundles = Bundle.objects.filter(products__in=q_supplier_products)

    return Response({"parts": PartSerializer(q_parts, many=True).data,
                     "supplierProducts": SupplierProductSerializer(q_supplier_products, many=True).data,
                     "bundles": BundleSerializer(q_bundles, many=True).data})


class Parts(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = PartSerializer

    def get_object(self, part_id):
        try:
            return Part.objects.get(pk=part_id)
        except Part.DoesNotExist:
            raise Http404

    def get_queryset(self):
        search_name = self.request.query_params.get('partName', None)
        search_brand = self.request.query_params.get('brand', None)
        include_standard = self.request.query_params.get('standard', None)
        include_stocked = self.request.query_params.get('stocked', None)
        q = Part.objects.all()
        if search_brand:
            q = q.filter(brand__id=search_brand)

        # if filter added on name add it to query set
        if search_name:
            q = q.filter(part_name__icontains=search_name)

        if include_standard == 'false':
            q = q.filter(standard=False)
        if include_stocked == 'false':
            q = q.filter(stocked=False)

        return q

    def get(self, request, format=None):
        serializer = PartSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def patch(self, request, part_id):
        part = self.get_object(part_id)
        serializer = PartSerializer(part, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, part_id):
        part = self.get_object(part_id)
        if not BikePart.objects.filter(part=part).exists() \
                and not QuotePart.objects.filter(part=part).exists():
            part.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)

    # post
    def post(self, request, format=None):
        post_data = request.data
        print(post_data)
        return_data = []
        errors = False
        for part in post_data:
            part_serializer = PartSerializer(data=part)
            supplier_product = part.get('supplierProduct')
            print("supplier product", supplier_product)
            if part.get('id'):
                existing_part = Part.objects.get(pk=part.get('id'))
            else:
                existing_part = Part.objects.filter(brand__id=part.get('brand'),
                                                    part_name=part.get('part_name')).first()

            if existing_part:
                part_serializer = PartSerializer(existing_part, data=part)

            if part_serializer.is_valid():
                part_serializer.save()
                part_id = part_serializer.data.get('id', None)
                if part_id and supplier_product:
                    supplier_product['part'] = part_id
                    supplier_product_serializer = SupplierProductSerializer(data=supplier_product)
                    existing_supplier_product = SupplierProduct.objects.get(part__id=part_id,
                                                                            supplier__id=supplier_product.get(
                                                                                'supplier')).first()
                    if existing_supplier_product:
                        supplier_product_serializer = SupplierProductSerializer(existing_supplier_product,
                                                                                data=supplier_product)

                    if supplier_product_serializer.is_valid():
                        supplier_product_serializer.save()
                    else:
                        errorPart = part_serializer.data
                        errorPart['supplierProduct'] = supplier_product_serializer.data
                        errorPart['error'] = True
                        errors = True
                        errorPart['error_detail'] = 'Part Supplier details could not be saved ' + str(
                            supplier_product_serializer.errors)
                        return_data.append(errorPart)
            else:
                part['error'] = True
                errors = True
                part['error_detail'] = 'Part could not be saved ' + str(part_serializer.errors)
                return_data.append(part)

        if errors:
            return Response(return_data, status=status.HTTP_202_ACCEPTED)

        return Response(return_data, status=status.HTTP_201_CREATED)
