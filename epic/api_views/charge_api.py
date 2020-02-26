from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.quote_serializer import ChargeSerializer
from epic.models.quote_models import Charge


class ChargeList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = ChargeSerializer

    def get_queryset(self):
        """
        Returns a JSON response with a listing of course objects
        """
        return Charge.objects.all()

    def get(self, request):
        return Response(charge_data())

    def post(self, request):
        post_data = request.data

        serializer = ChargeSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(charge_data(), status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def charge_data():
    charges = Charge.objects.filter(deleted=False)
    serializer = ChargeSerializer(charges, many=True)
    return serializer.data


class ChargeMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = ChargeSerializer

    def get_object(self, charge_id):
        try:
            return Charge.objects.get(pk=charge_id)
        except Charge.DoesNotExist:
            raise Http404

    def get(self, request, charge_id):
        charge = self.get_object(charge_id)
        serializer = ChargeSerializer(charge)
        return Response(serializer.data)

    def post(self, request, charge_id):
        charge = self.get_object(charge_id)
        serializer = ChargeSerializer(charge, data=request.data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(charge_data())

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, charge_id):
        charge = self.get_object(charge_id)
        if charge:
            charge.deleted = True
            charge.upd_by = request.user
            charge.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)
