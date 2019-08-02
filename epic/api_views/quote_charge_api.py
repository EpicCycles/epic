from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.note_helper import create_note_for_quote_charge
from epic.model_serializers.quote_serializer import QuoteChargeSerializer
from epic.models.quote_models import QuoteCharge


class QuoteChargeMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteChargeSerializer

    def get_object(self, quote_charge_id):
        try:
            return QuoteCharge.objects.get(id=quote_charge_id)
        except QuoteCharge.DoesNotExist:
            raise Http404

    def post(self, request):
        user = request.user
        quote_charge_data = request.data
        serializer = QuoteChargeSerializer(data=quote_charge_data)
        if serializer.is_valid():
            quote_charge = serializer.save()
            create_note_for_quote_charge(quote_charge, user, 'created')
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, quote_charge_id):
        user = request.user
        quote_charge = self.get_object(quote_charge_id)
        quote_charge_data = request.data
        serializer = QuoteChargeSerializer(quote_charge, data=quote_charge_data)
        if serializer.is_valid():
            quote_charge = serializer.save()
            create_note_for_quote_charge(quote_charge, user, 'updated')
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_charge_id):
        user = request.user
        quote_charge = self.get_object(quote_charge_id)
        create_note_for_quote_charge(quote_charge, user, 'deleted')
        quote_charge.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
