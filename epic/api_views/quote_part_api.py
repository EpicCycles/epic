from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.note_helper import create_note_for_quote_part
from epic.model_serializers.quote_serializer import QuotePartSerializer
from epic.models.brand_models import SupplierProduct
from epic.models.quote_models import QuotePart


def check_supplier_product(quote_part, quote_part_data):
    if quote_part.part and quote_part.part_price and quote_part.supplier:
        supplier_product = SupplierProduct.objects.filter(part=quote_part.part, supplier=quote_part.supplier).first()
        if not supplier_product:
            supplier_product = SupplierProduct(part=quote_part.part, supplier=quote_part.supplier)

        if quote_part.quote.bike:
            if supplier_product.fitted_price is not quote_part.part_price:
                supplier_product.fitted_price = quote_part.part_price
                supplier_product.save()
        else:
            ticket_price = quote_part_data.get('ticket_price', None)
            club_price = quote_part_data.get('club_price', None)
            if ticket_price or club_price:
                if club_price:
                    supplier_product.club_price = club_price
                if ticket_price:
                    supplier_product.ticket_price = ticket_price
                supplier_product.save()


class QuotePartMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuotePartSerializer

    def get_object(self, quote_part_id):
        try:
            return QuotePart.objects.get(id=quote_part_id)
        except QuotePart.DoesNotExist:
            raise Http404
        
    def post(self, request):
        user = request.user
        quote_part_data = request.data
        serializer = QuotePartSerializer(data=quote_part_data)
        if serializer.is_valid():
            quote_part = serializer.save()
            create_note_for_quote_part(quote_part, user, 'created')
            check_supplier_product(quote_part, quote_part_data)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, quote_part_id):
        user = request.user
        quote_part = self.get_object(quote_part_id)
        quote_part_data = request.data
        serializer = QuotePartSerializer(quote_part, data=quote_part_data)
        if serializer.is_valid():
            quote_part = serializer.save()
            create_note_for_quote_part(quote_part, user, 'updated')
            check_supplier_product(quote_part, quote_part_data)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_part_id):
        user = request.user
        quote_part = self.get_object(quote_part_id)
        create_note_for_quote_part(quote_part, user, 'deleted')
        quote_part.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
