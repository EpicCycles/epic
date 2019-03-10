from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework import serializers
from epic.model_serializers.note_serializer import CustomerNoteSerializer
from epic.model_serializers.quote_serializer import QuoteSerializer

from epic.models.customer_models import *


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'

    def validate_email(self, value):
        if value and not is_valid_email(value):
            raise serializers.ValidationError("Invalid Email")
        return value


class PaginatedCustomerSerializer():
    def __init__(self, customers, request, num):
        paginator = Paginator(customers, num)
        page = request.query_params.get('page')
        try:
            customers = paginator.page(page)
        except PageNotAnInteger:
            customers = paginator.page(1)
        except EmptyPage:
            customers = paginator.page(paginator.num_pages)
        count = paginator.count

        previous = '' if not customers.has_previous() else customers.previous_page_number()
        next = '' if not customers.has_next() else customers.next_page_number()
        serializer = CustomerSerializer(customers, many=True)
        self.data = {'count': count, 'previous': previous,
                     'next': next, 'customers': serializer.data}


class CustomerPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerPhone
        fields = '__all__'


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = '__all__'

    def validate_address1(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing Address 1")

    def validate_postcode(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing postcode")


class FittingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fitting
        fields = '__all__'

    def validate_fitting_type(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing fitting_type")

    def validate_saddle_height(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing saddle_height")

    def validate_saddle_height(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing saddle_height")

    def validate_reach(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing reach")
