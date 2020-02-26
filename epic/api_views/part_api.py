from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.part_serializer import PartSerializer, SupplierProductSerializer
from epic.models.brand_models import Part, SupplierProduct


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

    return Response({"parts": PartSerializer(q_parts, many=True).data,
                     "supplierProducts": SupplierProductSerializer(q_supplier_products, many=True).data})


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
        search_part_type = self.request.query_params.get('partType', None)
        search_name = self.request.query_params.get('partName', None)
        search_brand = self.request.query_params.get('brand', None)
        include_standard = self.request.query_params.get('standard', None)
        include_stocked = self.request.query_params.get('stocked', None)
        q = Part.objects.all()
        if search_part_type:
            q = q.filter(partType__id=search_part_type)
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

    def get(self, request):
        serializer = PartSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    # post
    def post(self, request):
        post_data = request.data
        user = request.user
        return_data = []
        errors = False
        part_type_id = None
        # remove the core flag from all part products prior to upload
        processed_part_types = []
        for part in post_data:
            part_serializer = PartSerializer(data=part)
            part_type_id = part.get('partType')

            if not part_type_id:
                part['error_detail'] = {'non_field_errors': 'Part could not be saved because no part type is present'}
                return_data.append(part)
                continue

            if processed_part_types.count(part_type_id) == 0:
                processed_part_types.push(part_type_id)
                Part.objects.filter(partType__id=part_type_id).update(standard__on=False, stocked__on=False,
                                                                      upd_by=user)

            if part.get('id'):
                existing_part = Part.objects.get(pk=part.get('id'))
            else:
                existing_part = Part.objects.filter(brand__id=part.get('brand'),
                                                    partType__id=part_type_id,
                                                    part_name__iexact=part.get('part_name')).first()

            if existing_part:
                part_serializer = PartSerializer(existing_part, data=part)

            if part_serializer.is_valid():
                part_serializer.save(upd_by=user)
                if existing_part:
                    SupplierProduct.objects.filter(part=existing_part).delete()

                supplier_product = part.get('supplierProduct')
                part_id = part_serializer.data.get('id', None)
                if part_id and supplier_product:
                    supplier_product['part'] = part_id
                    supplier_product_serializer = SupplierProductSerializer(data=supplier_product)

                    if supplier_product_serializer.is_valid():
                        supplier_product_serializer.save(upd_by=request.user)
                    else:
                        error_part = part_serializer.data
                        error_part['supplierProduct'] = supplier_product_serializer.data
                        errors = True
                        error_part['error_detail'] = {'non_field_errors': 'Part Supplier details could not be saved '}
                        return_data.append(error_part)
            else:
                errors = True
                part['error_detail'] = part_serializer.errors
                return_data.append(part)

        if errors:
            return Response(return_data, status=status.HTTP_202_ACCEPTED)

        if len(processed_part_types) > 0:
            q_parts = Part.objects.filter(partType__id__in=processed_part_types)
            # now filter supplier parts based on remaining parts
            q_supplier_products = SupplierProduct.objects.filter(part__in=q_parts)

            return_data = {"parts": PartSerializer(q_parts, many=True).data,
                           "supplierProducts": SupplierProductSerializer(q_supplier_products, many=True).data}

        return Response(return_data, status=status.HTTP_201_CREATED)


class PartMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = PartSerializer

    def get_object(self, part_id):
        try:
            return Part.objects.get(id=part_id)
        except Part.DoesNotExist:
            raise Http404

    def post(self, request):
        part = request.data
        existing_part = Part.objects.filter(brand__id=part.get('brand'),
                                            partType__id=part.get('partType'),
                                            part_name__iexact=part.get('part_name')).first()
        if existing_part:
            serializer = PartSerializer(instance=existing_part, data=request.data)
        else:
            serializer = PartSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, part_id):
        part = self.get_object(part_id)
        serializer = PartSerializer(instance=part, data=request.data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, part_id):
        part = self.get_object(part_id)
        if part.countUses == 0:
            part.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        part.standard = False
        part.stocked = False
        part.save()
        return Response(status=status.HTTP_403_FORBIDDEN)


class SupplierProductMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = SupplierProductSerializer

    def get_object(self, supplier_product_id):
        try:
            return SupplierProduct.objects.get(id=supplier_product_id)
        except SupplierProduct.DoesNotExist:
            raise Http404

    def post(self, request):
        serializer = SupplierProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, supplier_product_id):
        supplier_product = self.get_object(supplier_product_id)
        serializer = SupplierProductSerializer(supplier_product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, supplier_product_id):
        supplier_product = self.get_object(supplier_product_id)
        supplier_product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
