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
        quantity = data.get('quantity')
        quote_price = data.get('quote_price')
        not_required = data.get('not_required')
        additional_data = data.get('additional_data')

        if self.instance:
            if not quote:
                quote = self.instance.quote

        if not Quote.objects.get(id=quote).exclude(quote_status='2').exists():
            raise serializers.ValidationError("Quote part must be part of a current quote")

        if not_required:
            if part or quantity or additional_data:
                raise serializers.ValidationError("Quote part must not have any other data if the part is not required")
            if not quote_price:
                raise serializers.ValidationError("A price must be entered, can be zero.")

        else:
            if not (quantity and quote_price):
                raise serializers.ValidationError("Replacement parts must have a price and a quantity")


