from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework import serializers

from epic.helpers.validation_helper import is_valid_email
from epic.models.customer_models import *


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'
        validators = []  # Remove a default "unique together" constraint.

    def validate(self, data):
        first_name = data.get('first_name')
        last_name = data.get('last_name')
        email = data.get('email', '')
        if self.instance:
            if Customer.objects.filter(first_name__iexact=first_name, last_name__iexact=last_name, email__iexact=email) \
                    .exclude(id=self.instance.id).exists():
                raise serializers.ValidationError("A customer already exists with the same details")
        else:
            if Customer.objects.filter(first_name__iexact=first_name, last_name__iexact=last_name, email__iexact=email) \
                    .exists():
                raise serializers.ValidationError("A customer already exists with the same details")

        return data

        # Apply custom validation either here, or in the view.

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


class PaginatedCustomerSerializer:
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
        validators = []

    def validate(self, data):
        telephone = data.get('telephone')
        customer = data.get('customer')
        if self.instance:
            if CustomerPhone.objects.filter(customer=customer, telephone__iexact=telephone) \
                    .exclude(id=self.instance.id).exists():
                raise serializers.ValidationError('This phone number is already in use for the same customer')
        else:
            if CustomerPhone.objects.filter(customer=customer, telephone__iexact=telephone) \
                    .exists():
                raise serializers.ValidationError('This phone number is already in use for the same customer')
        return data

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
        validators = []

    def validate(self, data):
        address1 = data.get('address1')
        postcode = data.get('postcode')
        customer = data.get('customer')
        existing_addresses = CustomerAddress.objects.filter(customer=customer, address1__iexact=address1,
                                                            postcode__iexact=postcode)

        if self.instance:
            existing_addresses = existing_addresses.exclude(id=self.instance.id)

        if existing_addresses.exists():
            raise serializers.ValidationError('This address is already in use for the same customer')

        return data

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
    def validate_saddle_height(value):
        if value:
            return value
        raise serializers.ValidationError("Missing saddle_height")

    @staticmethod
    def validate_bar_height(value):
        if value:
            return value
        raise serializers.ValidationError("Missing bar_height")

    @staticmethod
    def validate_reach(value):
        if value:
            return value
        raise serializers.ValidationError("Missing reach")
