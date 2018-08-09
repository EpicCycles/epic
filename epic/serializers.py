from rest_framework import serializers
from rest_framework.compat import authenticate

from epic.models import *


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


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


class CustomerEditSerializer(serializers.ModelSerializer):
    customeraddress_set = CustomerAddressSerializer(many=True)
    customerphone_set = CustomerPhoneSerializer(many=True)
    fitting_set = FittingSerializer(many=True)

    class Meta:
        model = Customer
        fields = '__all__'


class CustomerNoteEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerNote
        fields = '__all__'


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


class CustomerNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerNote
        fields = '__all__'
