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

    def get_queryset(self):
        customer_id = self.request.query_params.get('customer_id', None)
        return customer_phone_data(customer_id)

    def get(self, request):
        """
        Returns a JSON response with a listing of course objects
        """
        customer_id = self.request.query_params.get('customer_id', None)
        return Response(self.get_queryset())

    def post(self, request):
        serializer = CustomerPhoneSerializer(data=request.data)
        if serializer.is_valid():
            customer_phone = serializer.save()
            one_preferred_phone(customer_phone)
            customer_id = serializer.data['customer']
            return Response(customer_phone_data(customer_id), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def customer_phone_data(customer_id):
    customer_phones = CustomerPhone.objects.filter(customer=customer_id)
    serializer = CustomerPhoneSerializer(customer_phones, many=True)
    return serializer.data


def one_preferred_phone(phone):
    if phone.preferred:
        CustomerPhone.objects.filter(customer=phone.customer) \
            .exclude(id=phone.id).update(preferred=False)


class CustomerPhoneMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = CustomerPhoneSerializer

    def get_object(self, pk):
        try:
            return CustomerPhone.objects.get(pk=pk)
        except CustomerPhone.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer_phone = self.get_object(pk)
        serializer = CustomerPhoneSerializer(customer_phone)
        return Response(serializer.data)

    def post(self, request, pk):
        customer_phone = self.get_object(pk)
        customer_id = customer_phone.customer
        serializer = CustomerPhoneSerializer(customer_phone, data=request.data)
        if serializer.is_valid():
            customer_phone = serializer.save()
            one_preferred_phone(customer_phone)
            return Response(customer_phone_data(customer_id))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer_phone = self.get_object(pk)
        customer_id = customer_phone.customer
        customer_phone.delete()
        return Response(customer_phone_data(customer_id))
