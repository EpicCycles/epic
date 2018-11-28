from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.customer_serializer import CustomerPhoneSerializer
from epic.models.customer_models import CustomerPhone


class CustomerPhoneList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerPhoneSerializer

    def get(self, request, format=None):
        """
        Returns a JSON response with a listing of course objects
        """
        customerId = self.request.query_params.get('customerId', None)
        return Response(customerPhoneData(customerId))

    def post(self, request, format=None):
        serializer = CustomerPhoneSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            customerId = serializer.data['customer']
            return Response(customerPhoneData(customerId), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def customerPhoneData(customerId):
    customerPhones = CustomerPhone.objects.filter(customer=customerId)
    serializer = CustomerPhoneSerializer(customerPhones, many=True)
    return serializer.data


class CustomerPhoneMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    # serializer_class = CustomerPhoneSerializer

    def get_object(self, pk):
        try:
            return CustomerPhone.objects.get(pk=pk)
        except CustomerPhone.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        customerPhone = self.get_object(pk)
        serializer = CustomerPhoneSerializer(customerPhone)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        customerPhone = self.get_object(pk)
        customerId = customerPhone.customer
        serializer = CustomerPhoneSerializer(customerPhone, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(customerPhoneData(customerId))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        customerPhone = self.get_object(pk)
        customerId = customerPhone.customer
        customerPhone.delete()
        return Response(customerPhoneData(customerId))
