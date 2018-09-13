from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.models import CustomerAddress
from epic.serializers import CustomerAddressSerializer


class CustomerAddressList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerAddressSerializer

    def get(self, request, format=None):
        """
        Returns a JSON response with a listing of course objects
        """
        customerId = self.request.query_params.get('customerId', None)
        return Response(customerAddressData(customerId))

    def post(self, request, format=None):
        serializer = CustomerAddressSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            customerId = serializer.data['customer']
            return Response(customerAddressData(customerId), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def customerAddressData(customerId):
    customerAddresses = CustomerAddress.objects.filter(customer__pk=customerId)
    serializer = CustomerAddressSerializer(customerAddresses, many=True)
    return serializer.data


class CustomerAddressMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    # serializer_class = CustomerAddressSerializer

    def get_object(self, pk):
        try:
            return CustomerAddress.objects.get(pk=pk)
        except CustomerAddress.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        customerAddress = self.get_object(pk)
        serializer = CustomerAddressSerializer(customerAddress)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        customerAddress = self.get_object(pk)
        customerId = customerAddress.customer
        serializer = CustomerAddressSerializer(customerAddress, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(customerAddressData(customerId))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        customerAddress = self.get_object(pk)
        customerId = customerAddress.customer.id
        customerAddress.delete()
        return Response(customerAddressData(customerId))
