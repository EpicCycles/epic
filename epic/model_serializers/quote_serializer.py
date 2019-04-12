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
        part_price = data.get('part_price')
        trade_in_price = data.get('trade_in_price')
        not_required = data.get('not_required')

        if self.instance:
            if not quote:
                quote = self.instance.quote

        if not Quote.objects.get(id=quote).exclude(quote_status='2').exists():
            raise serializers.ValidationError("Quote part must be part of a current quote")

        if not_required:
            if not trade_in_price:
                raise serializers.ValidationError("A trade in price must be entered, can be zero.")

        if part:
            if not (quantity and part_price):
                raise serializers.ValidationError("Parts must have a price and a quantity")


