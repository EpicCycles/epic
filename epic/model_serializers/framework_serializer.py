from rest_framework import serializers

from epic.models import PartSection, PartType, PartTypeAttribute, AttributeOptions


class AttributeOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeOptions
        fields = '__all__'



class PartTypeAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartTypeAttribute
        fields = '__all__'


class PartTypeSerializer(serializers.ModelSerializer):
    attributes = PartTypeAttributeSerializer(many=True)

    class Meta:
        model = PartType
        fields = '__all__'


# whole Framework serializer
class FrameworkSerializer(serializers.ModelSerializer):
    partTypes = PartTypeSerializer(many=True)

    class Meta:
        model = PartSection
        fields = ('id', 'name', 'placing', 'partTypes')
