from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.note_helper import create_note_for_requote, create_note_for_new_quote, create_note_for_saved_quote, \
    create_note_for_issue
from epic.helpers.quote_helper import copy_quote_with_changes
from epic.model_serializers.bike_serializer import BikePartSerializer, BikeSerializer, FrameSerializer
from epic.model_serializers.customer_serializer import CustomerSerializer
from epic.model_serializers.note_serializer import CustomerNoteSerializer
from epic.model_serializers.part_serializer import SupplierProductSerializer, PartSerializer
from epic.model_serializers.quote_serializer import QuoteSerializer, QuotePartSerializer, QuoteChargeSerializer, \
    QuoteAnswerSerializer
from epic.models.bike_models import Frame, Bike, BikePart
from epic.models.brand_models import Part, SupplierProduct
from epic.models.customer_models import Customer
from epic.models.note_models import CustomerNote
from epic.models.quote_models import Quote, QuotePart, INITIAL, ARCHIVED, ISSUED, QuoteCharge, QuoteAnswer


class QuotesApi(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = QuoteSerializer

    def get_queryset(self):
        search_quote_description = self.request.query_params.get('quoteDesc', None)
        search_customer = self.request.query_params.get('selectedCustomer', None)
        search_brand = self.request.query_params.get('brand', None)
        search_name = self.request.query_params.get('frameName', None)
        search_bike = self.request.query_params.get('bike', None)
        include_archived = self.request.query_params.get('archived', False)

        q = Quote.objects.all()

        if include_archived != 'true':
            q = q.exclude(quote_status=ARCHIVED)

        if search_quote_description:
            q = q.filter(quote_desc__icontains=search_quote_description)

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

        return q

    def get(self, request):

        quotes = self.get_queryset()
        full_quote_data = build_quotes_and_related_data(quotes)

        if quotes.first():
            full_quote_data['quoteId'] = quotes.first().id

            quote_customers = quotes.values_list('customer__id', flat=True)
            customers = Customer.objects.filter(id__in=quote_customers)
            customer_serializer = CustomerSerializer(customers, many=True)

            full_quote_data['customers'] = customer_serializer.data

        return Response(full_quote_data)

    def post(self, request):
        user = request.user
        serializer = QuoteSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save(created_by=user)
            create_note_for_new_quote(quote, user)
            return Response(quote_data_for_quote_or_customer(quote))

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def quote_data_for_quote_or_customer(quote=None, customer=None):
    quote_id = None
    if quote:
        customer = quote.customer
        quote_id = quote.id

    quotes = Quote.objects.filter(customer=customer).exclude(quote_status=ARCHIVED)
    full_quote_data = build_quotes_and_related_data(quotes)

    full_quote_data['quoteId'] = quote_id
    full_quote_data['customerId'] = customer.id
    return full_quote_data


def build_quotes_and_related_data(quotes):
    quote_bike_ids = quotes.values_list('bike__id', flat=True)
    quote_serializer = QuoteSerializer(quotes, many=True)
    quote_parts = QuotePart.objects.filter(quote__in=quotes)
    quote_answers = QuoteAnswer.objects.filter(quote__in=quotes)
    quote_answer_serializer = QuoteAnswerSerializer(quote_answers, many=True)
    quote_charges = QuoteCharge.objects.filter(quote__in=quotes)
    quote_charge_serializer = QuoteChargeSerializer(quote_charges, many=True)
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

    notes = CustomerNote.objects.filter(quote__in=quotes)
    notes_serializer = CustomerNoteSerializer(notes, many=True)

    parts_from_quotes = Part.objects.filter(id__in=list(quote_part_part_ids))
    parts_from_bikes = Part.objects.filter(id__in=list(bike_part_part_ids))
    parts = parts_from_bikes.union(parts_from_quotes)
    part_serializer = PartSerializer(parts, many=True)
    supplier_product_list = SupplierProduct.objects.filter(part__in=parts_from_bikes)
    supplier_product_serializer = SupplierProductSerializer(supplier_product_list, many=True)
    full_quote_data = {'quotes': quote_serializer.data,
                       'quoteParts': quote_part_serializer.data,
                       'quoteAnswers': quote_answer_serializer.data,
                       'quoteCharges': quote_charge_serializer.data,
                       'frames': frame_serializer.data,
                       'bikes': bike_serializer.data,
                       'notes': notes_serializer.data,
                       'parts': part_serializer.data,
                       'supplierProducts': supplier_product_serializer.data,
                       'bikeParts': bike_part_serializer.data}
    return full_quote_data


def get_quote_object(quote_id):
    try:
        return Quote.objects.get(pk=quote_id)
    except Quote.DoesNotExist:
        raise Http404


class QuoteMaintain(generics.GenericAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        return get_quote_object(quote_id)

    def get(self, request, quote_id):
        quote = get_quote_object(quote_id)
        return Response(quote_data_for_quote_or_customer(quote))

    def put(self, request, quote_id):
        quote = self.get_object(quote_id)
        serializer = QuoteSerializer(quote, data=request.data)
        if serializer.is_valid():
            serializer.save()
            quote.recalculate_price()
            create_note_for_saved_quote(quote, request.user)
            return Response(quote_data_for_quote_or_customer(quote))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_id):
        quote = self.get_object(quote_id)
        customer = quote.customer
        quote.delete()
        return Response(quote_data_for_quote_or_customer(None, customer))


class QuoteCopy(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        return get_quote_object(quote_id)

    def post(self, request, quote_id):
        quote = self.get_object(quote_id)
        post_data = request.data

        customer_id = post_data.get('customer', None)
        bike_id = post_data.get('bike', None)
        quote_desc = post_data.get('quote_desc', None)
        customer = None
        bike = None
        if customer_id:
            customer = Customer.objects.get(id=customer_id)

        if bike_id:
            bike = Bike.objects.get(id=bike_id)
        print(customer, bike, quote_desc)
        new_quote = copy_quote_with_changes(quote, request.user, quote_desc, bike, customer)
        new_quote.recalculate_price()
        return Response(quote_data_for_quote_or_customer(new_quote))


class QuoteArchive(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        return get_quote_object(quote_id)

    def post(self, request, quote_id):
        quote = self.get_object(quote_id)
        if quote.quote_status is INITIAL or quote.quote_status is ISSUED:
            quote.archive()
            return Response(QuoteSerializer(quote).data)
        else:
            return Response(status=status.HTTP_304_NOT_MODIFIED)


class QuoteUnArchive(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        try:
            return Quote.objects.get(id=quote_id)
        except Quote.DoesNotExist:
            raise Http404

    def post(self, request, quote_id):
        quote = self.get_object(quote_id)
        if quote.quote_status is ARCHIVED:
            quote.archive_reset()
            create_note_for_requote(quote, request.user)
            return Response(QuoteSerializer(quote).data)
        else:
            return Response(status=status.HTTP_304_NOT_MODIFIED)


class QuoteIssue(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        try:
            return Quote.objects.get(id=quote_id)
        except Quote.DoesNotExist:
            raise Http404

    def post(self, request, quote_id):
        quote = self.get_object(quote_id)
        quote.issue()
        create_note_for_issue(quote, request.user)
        return Response(QuoteSerializer(quote).data)


class QuoteRecalculate(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteSerializer

    def get_object(self, quote_id):
        try:
            return Quote.objects.get(id=quote_id)
        except Quote.DoesNotExist:
            raise Http404

    def post(self, request, quote_id):
        quote = self.get_object(quote_id)
        quote.recalculate_price()
        return Response(quote_data_for_quote_or_customer(quote))
