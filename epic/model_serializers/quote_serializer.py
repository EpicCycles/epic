from rest_framework import serializers

from epic.models.quote_models import Quote, QuotePart


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class QuotePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotePart
        fields = '__all__'

    def validate(self, data):
        quote = data.get('quote')
        part = data.get('part')
        not_required = data.get('not_required')
        quantity = data.get('quantity')

        # if self.instance:
        #     if not quote:
        #         quote = self.instance.quote
        #
        if quote.quote_status is '2':
            raise serializers.ValidationError("Quote part must be part of a current quote")

        if not (part or not_required):
            raise serializers.ValidationError("Quote part must either be a replacement part or include part details")
        if part:
            if not quantity:
                raise serializers.ValidationError("Parts must have a quantity")

        return data

