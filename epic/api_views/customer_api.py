from django.db.models import Q
from django.http import Http404
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.model_serializers.bike_serializer import BikeSerializer, FrameSerializer
from epic.model_serializers.customer_serializer import CustomerSerializer, PaginatedCustomerSerializer
from epic.model_serializers.note_serializer import CustomerNoteSerializer
from epic.model_serializers.quote_serializer import QuoteSerializer
from epic.models.bike_models import Bike, Frame
from epic.models.customer_models import Customer
from epic.models.note_models import CustomerNote
from epic.models.quote_models import Quote


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

    def get(self, request):
        """
        Returns a JSON response with a listing of customer objects
        """
        customers = self.get_queryset()
        serializer = PaginatedCustomerSerializer(customers, request, 20)
        return Response(serializer.data)

    def post(self, request):
        serializer = CustomerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerMaintain(generics.GenericAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)

    serializer_class = CustomerSerializer

    def get_object(self, pk):
        try:
            return Customer.objects.get(pk=pk)
        except Customer.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer)

        note_list = CustomerNote.objects.filter(customer=customer)
        quote_list = Quote.objects.filter(customer=customer)

        quote_bike_ids = quote_list.values_list('bike__id', flat=True)
        bikes = Bike.objects.filter(id__in=quote_bike_ids)
        bike_serializer = BikeSerializer(bikes, many=True)

        bike_frame_ids = bikes.values_list('frame__id', flat=True)
        frames = Frame.objects.filter(id__in=bike_frame_ids)
        frame_serializer = FrameSerializer(frames, many=True)

        return Response({'customer': serializer.data,
                         'notes': CustomerNoteSerializer(note_list, many=True).data,
                         'quotes': QuoteSerializer(quote_list, many=True).data,
                         'frames': frame_serializer.data,
                         'bikes': bike_serializer.data
                         })

    def post(self, request, pk):
        customer = self.get_object(pk)
        serializer = CustomerSerializer(customer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer = self.get_object(pk)
        customer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
