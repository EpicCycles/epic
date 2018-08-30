from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage
from django.db.models import Q
from django.http import Http404
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.models import Customer
from epic.serializers import CustomerSerializer, PaginatedCustomerSerializer


class CustomerList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerSerializer

    def get_queryset(self):
        search_first_name = self.request.query_params.get('firstName', None)
        search_last_name = self.request.query_params.get('lastName', None)
        search_email = self.request.query_params.get('email', None)
        page = self.request.query_params.get('page', 1)
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if search_first_name:
            where_filter &= Q(first_name__icontains=search_first_name)

        # if filter added on last name add it to query set
        if search_last_name:
            where_filter &= Q(last_name__icontains=search_last_name)
        # if filter added on email add it to query set
        if search_email and (search_email is not '@'):
            where_filter &= Q(email__icontains=search_email)

        # find objects matching any filter and order them
        objects = Customer.objects.filter(where_filter).order_by('last_name', 'first_name', 'id')
        return objects

    def get(self, request, format=None):
        """
        Returns a JSON response with a listing of course objects
        """
        customers = self.get_queryset()
        serializer = PaginatedCustomerSerializer(customers, request, 20)
        return Response(serializer.data)

    def post(self, request, format=None):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerSerializer

    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)
        return Response(serializer.data)

    def post(self, request, pk, format=None):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk, format=None):
        customer = self.get_object(pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
