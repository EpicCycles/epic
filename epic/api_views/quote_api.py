from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.quote_helper import copy_quote_with_changes
from epic.model_serializers.bike_serializer import BikePartSerializer, BikeSerializer, FrameSerializer
from epic.model_serializers.customer_serializer import CustomerSerializer
from epic.model_serializers.part_serializer import SupplierProductSerializer, PartSerializer
from epic.model_serializers.quote_serializer import QuoteSerializer, QuotePartSerializer
from epic.models.bike_models import Frame, Bike, BikePart
from epic.models.brand_models import Part, SupplierProduct
from epic.models.customer_models import Customer
from epic.models.quote_models import Quote, QuotePart


class QuotesApi(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = QuoteSerializer
    
    def get_queryset(self):
        search_customer = self.request.query_params.get('customer', None)
        search_brand = self.request.query_params.get('brand', None)
        search_name = self.request.query_params.get('frameName', None)
        search_bike = self.request.query_params.get('bike', None)
        include_archived = self.request.query_params.get('archived', None)
        q = Quote.objects.all()

        if search_customer:
            q = q.filter(customer__id=search_customer)
        if search_bike:
            q = q.filter(bike__id=search_bike)
        elif search_name or search_brand:
            q_frames = Frame.objects.all()
            if search_brand:
                q_frames = q_frames.filter(brand__id=search_brand)

            # if filter added on name add it to query set
            if search_name:
                q_frames = q_frames.filter(frame_name__icontains=search_name)

            q = q.filter(bike__frame__in=q_frames)

        # if filter added on name add it to query set
        if search_name:
            q = q.filter(part_name__icontains=search_name)

        if not include_archived:
            q.exclude(quote_status=3)
        return q

    def get(self, request):

        quotes = self.get_queryset()
        quote_serializer = QuoteSerializer(quotes, many=True)

        quote_customers = quotes.values_list('customer__id', flat=True)
        customers = Customer.objects.filter(id__in=quote_customers)
        customer_serializer = CustomerSerializer(customers, many=True)

        quote_bike_ids = quotes.values_list('bike__id', flat=True)
        bikes = Bike.objects.filter(id__in=quote_bike_ids)
        bike_serializer = BikeSerializer(bikes, many=True)

        bike_frame_ids = bikes.values_list('frame__id', flat=True)
        frames = Frame.objects.filter(id__in=bike_frame_ids)
        frame_serializer = FrameSerializer(frames, many=True)

        return Response({'quotes': quote_serializer.data,
                         'frames': frame_serializer.data,
                         'bikes': bike_serializer.data,
                         'customers': customer_serializer.data})

    def post(self, request):
        serializer = QuoteSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save()
            return Response(quote_data(quote))

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def quote_data(quote=None, customer=None):
    quote_id = None
    if quote:
        customer = quote.customer
        quote_id = quote.id

    quotes = Quote.objects.filter(customer=customer, quote_status__in=[1, 2, 4])
    quote_bike_ids = quotes.values_list('bike__id', flat=True)
    quote_serializer = QuoteSerializer(quotes, many=True)

    quote_parts = QuotePart.objects.filter(quote__in=quotes)
    quote_part_part_ids = quote_parts.values_list('part__id', flat=True)
    quote_part_serializer = QuotePartSerializer(quote_parts, many=True)

    bikes = Bike.objects.filter(id__in=quote_bike_ids)
    bike_serializer = BikeSerializer(bikes, many=True)

    bike_parts = BikePart.objects.filter(bike__in=bikes)
    bike_part_part_ids = bike_parts.values_list('part__id', flat=True)
    bike_part_serializer = BikePartSerializer(bike_parts, many=True)

    bike_frame_ids = bikes.values_list('frame__id', flat=True)
    frames = Frame.objects.filter(id__in=bike_frame_ids)
    frame_serializer = FrameSerializer(frames, many=True)

    parts_from_quotes = Part.objects.filter(id__in=list(quote_part_part_ids))
    parts_from_bikes = Part.objects.filter(id__in=list(bike_part_part_ids))
    parts = parts_from_bikes.union(parts_from_quotes)
    part_serializer = PartSerializer(parts, many=True)

    supplier_product_list = SupplierProduct.objects.filter(part__in=parts_from_bikes)
    supplier_product_serializer = SupplierProductSerializer(supplier_product_list, many=True)

    return {'quoteId': quote_id,
            'customerId': customer.id,
            'quotes': quote_serializer.data,
            'quoteParts': quote_part_serializer.data,
            'frames': frame_serializer.data,
            'bikes': bike_serializer.data,
            'parts': part_serializer.data,
            'supplierProducts': supplier_product_serializer.data,
            'bikeParts': bike_part_serializer.data}


class QuoteMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, pk):
        try:
            return Quote.objects.get(id=pk)
        except Quote.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        quote = self.get_object(pk)
        return Response(quote_data(quote))

    def put(self, request, pk):
        quote = self.get_object(pk)
        serializer = QuoteSerializer(quote, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(quote_data(quote))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        quote = self.get_object(pk)
        customer = quote.customer
        quote.delete()
        return Response(quote_data(None, customer))


class QuoteCopy(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, pk):
        try:
            return Quote.objects.get(id=pk)
        except Quote.DoesNotExist:
            raise Http404

    def post(self, request, pk):
        quote = self.get_object(pk)
        customer_id = self.request.query_params.get('customer', None)
        bike_id = self.request.query_params.get('bike', None)
        quote_desc = self.request.query_params.get('quote_desc', None)
        customer = None
        bike = None
        if customer_id:
            customer = Customer.objects.get(id=customer_id)
            
        if bike_id:
            bike = Bike.objects.get(id=bike_id)
        
        new_quote = copy_quote_with_changes(quote, request, quote_desc, bike, customer)
        return Response(quote_data(new_quote))

