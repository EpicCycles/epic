from django.contrib.auth.models import User
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from rest_framework import serializers, viewsets, routers

from epic.models import *


# Serializers define the API representation.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'is_staff', 'is_active', 'is_superuser', 'first_name', 'last_name')


# http://127.0.0.1:8000/api-auth/login/?next=/users/

# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


# Routers provide a way of automatically determining the URL conf.
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


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


class FittingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fitting
        fields = '__all__'


class CustomerNoteSerializer(serializers.ModelSerializer):
    quote = serializers.StringRelatedField(many=False)
    class Meta:
        model = CustomerNote
        fields = ('note_text', 'customer_visible', 'created_on', 'created_by', 'quote')

    def to_representation(self, obj):
        data = super(CustomerNoteSerializer, self).to_representation(obj)
        created_by = str(User.objects.get(id=data['created_by']))
        data['created_by'] = created_by
        return data

class PartSectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartSection
        fields = '__all__'


class PartTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartType
        fields = '__all__'


class AttributeOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeOptions
        fields = '__all__'


class PartTypeAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartTypeAttribute
        fields = '__all__'


class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'


class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'


class FramePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = FramePart
        fields = '__all__'


class FrameExclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameExclusion
        fields = '__all__'


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class QuotePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotePart
        fields = '__all__'


class QuotePartAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotePartAttribute
        fields = '__all__'


# whole CUstomer serializer
class CustomerEditSerializer(serializers.ModelSerializer):
    addresses = CustomerAddressSerializer(many=True, read_only=True)
    phones = CustomerPhoneSerializer(many=True, read_only=True)
    notes = CustomerNoteSerializer(many=True, read_only=True)
    fittings = FittingSerializer(many=True, read_only=True)
    quotes = QuoteSerializer(many=True, read_only=True)

    class Meta:
        model = Customer
        fields = ('id', 'first_name', 'last_name', 'email', 'addresses', 'phones', 'notes', 'fittings', 'quotes')
