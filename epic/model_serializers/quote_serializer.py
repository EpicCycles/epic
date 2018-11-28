from rest_framework import serializers

from epic.models.quote_models import Quote, QuotePart, QuotePartAttribute


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

