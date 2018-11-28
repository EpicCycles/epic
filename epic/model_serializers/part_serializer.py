from rest_framework import serializers

from epic.models.brand_models import Part


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'

