from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework import serializers
from rest_framework.validators import UniqueTogetherValidator

from epic.models.customer_models import *


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        # Customer first name last name and email must not be repeated in same comboination.
        validators = [
            UniqueTogetherValidator(
                queryset=Customer.objects.all(),
                fields=('first_name', 'last_name', 'email')
            )
        ]

    @staticmethod
    def validate_first_name(value):
        if value:
            return value

        raise serializers.ValidationError("First name must be provided")

    @staticmethod
    def validate_last_name(value):
        if value:
            return value

        raise serializers.ValidationError("Last name must be provided")

    @staticmethod
    def validate_email(value):
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
        next_page = '' if not customers.has_next() else customers.next_page_number()
        serializer = CustomerSerializer(customers, many=True)
        self.data = {'count': count, 'previous': previous,
                     'next': next_page, 'customers': serializer.data}


class CustomerPhoneSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerPhone
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=CustomerPhone.objects.all(),
                fields=('customer', 'telephone'),
                message='This phone number is already in use for the same customer'
            )
        ]

    @staticmethod
    def validate_number_type(value):
        if value:
            if value not in [HOME, WORK, MOBILE]:
                raise serializers.ValidationError('Number type must be Home, Work or Mobile')
            return value
        raise serializers.ValidationError("Number Type must be given")

    @staticmethod
    def validate_telephone(value):
        if value:
            return value
        raise serializers.ValidationError("Phone number must be given")


class CustomerAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerAddress
        fields = '__all__'
        validators = [
            UniqueTogetherValidator(
                queryset=CustomerAddress.objects.all(),
                fields=('customer', 'address1', 'postcode'),
                message='This address is already in use for the customer'
            )
        ]

    @staticmethod
    def validate_address1(value):
        if value:
            return value
        raise serializers.ValidationError("Missing Address 1")

    @staticmethod
    def validate_postcode(value):
        if value:
            return value
        raise serializers.ValidationError("Missing postcode")


class FittingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fitting
        fields = '__all__'

    @staticmethod
    def validate_fitting_type(value):
        if value:
            return value
        raise serializers.ValidationError("Missing fitting_type")

    @staticmethod
    def validate_saddle_height(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing saddle_height")

    @staticmethod
    def validate_saddle_height(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing saddle_height")

    @staticmethod
    def validate_reach(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing reach")
