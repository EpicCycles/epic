from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.customer_serializer import CustomerAddressSerializer
from epic.models.customer_models import CustomerAddress


class CustomerAddressList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerAddressSerializer

    def get(self, request):
        """
        Returns a JSON response with a listing of course objects
        """
        customer_id = self.request.query_params.get('customer_id', None)
        return Response(customer_address_data(customer_id))

    def post(self, request):
        post_data = request.data

        serializer = CustomerAddressSerializer(data=post_data)
        if serializer.is_valid():
            updated_address = serializer.save()
            one_billing_address(updated_address)
            customer_id = serializer.data['customer']
            return Response(customer_address_data(customer_id), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def customer_address_data(customer_id):
    customer_addresses = CustomerAddress.objects.filter(customer__pk=customer_id)
    serializer = CustomerAddressSerializer(customer_addresses, many=True)
    return serializer.data


def one_billing_address(address):
    if address.billing:
        CustomerAddress.objects.filter(customer=address.customer)\
            .exclude(id=address.id).update(billing=False)


class CustomerAddressMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = CustomerAddressSerializer

    def get_object(self, pk):
        try:
            return CustomerAddress.objects.get(pk=pk)
        except CustomerAddress.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer_address = self.get_object(pk)
        serializer = CustomerAddressSerializer(customer_address)
        return Response(serializer.data)

    def post(self, request, pk):
        customer_address = self.get_object(pk)
        print(customer_address.id, customer_address.customer)
        customer_id = customer_address.customer.id
        serializer = CustomerAddressSerializer(customer_address, data=request.data)
        if serializer.is_valid():
            new_address = serializer.save()
            one_billing_address(new_address)

            return Response(customer_address_data(customer_id))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer_address = self.get_object(pk)
        customer_id = customer_address.customer.id
        customer_address.delete()
        return Response(customer_address_data(customer_id))
