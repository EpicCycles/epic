from rest_framework import serializers

from epic.models.quote_models import Quote, QuotePart, Charge, QuoteCharge


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class QuotePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotePart
        fields = '__all__'

    def validate(self, data):
        part = data.get('part')
        not_required = data.get('not_required')
        quantity = data.get('quantity')

        # if self.instance:
        #     if not quote:
        #         quote = self.instance.quote
        #
        # if quote.quote_status is '2':
        #     raise serializers.ValidationError("Quote part must be part of a current quote")

        if not (part or not_required):
            raise serializers.ValidationError("Quote part must either be a replacement part or include part details")
        if part:
            if not quantity:
                raise serializers.ValidationError("Parts must have a quantity")

        return data


class ChargeSerializer(serializers.ModelSerializer):
    can_be_deleted = serializers.SerializerMethodField()

    class Meta:
        model = Charge
        fields = '__all__'

    def get_can_be_deleted(self, charge):
        return not QuoteCharge.objects.filter(charge=charge).exists()

    def validate(self, data):
        charge_name = data.get('charge_name')
        existing_charges = Charge.objects.filter(charge_name__iexact=charge_name)
        if self.instance:
            existing_charges = existing_charges.exclude(id=self.instance.id)

        if existing_charges.exists():
            raise serializers.ValidationError('This brand is already set up')
        return data

    def validate_charge_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing name")


class QuoteChargeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteCharge
        fields = '__all__'
