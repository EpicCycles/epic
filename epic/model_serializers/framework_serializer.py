from rest_framework import serializers

from epic.models.framework_models import *


class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartSection
        fields = '__all__'

    def validate_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing name")

    def validate_placing(self, value):
        if value and isinstance(value, int) and value > 0:
            return value
        raise serializers.ValidationError("Invalid placing")


class PartTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartType
        fields = '__all__'

    def validate_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing name")

    def validate_placing(self, value):
        if value and isinstance(value, int) and value > 0:
            return value
        raise serializers.ValidationError("Invalid placing")

    def validate_includeInSection(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing PartSection")


class PartTypeAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartTypeAttribute
        fields = '__all__'

    def validate_attribute_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing attribute_name")

    def validate_placing(self, value):
        if value and isinstance(value, int) and value > 0:
            return value
        raise serializers.ValidationError("Invalid placing")

    def validate_partType(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing PartType")

    def validate_attribute_type(self, value):
        if value and value in [TEXT, NUMBER, RADIO, SELECT, MULTIPLE_C, MULTIPLE_S]:
            return value
        raise serializers.ValidationError("Invalid attribute_type")


class PartTypeSynonymSerializer(serializers.ModelSerializer):
    class Meta:
        model = PartTypeSynonym
        fields = '__all__'

    def validate_name(self, value):
        if value:
            if PartType.objects.filter(name=value).exists():
                raise serializers.ValidationError("Value in use for a part name")
            return value
        raise serializers.ValidationError("Missing value for synonym")


class AttributeOptionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = AttributeOptions
        fields = '__all__'

    def validate_attribute_option(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing attribute_option")

    def validate_part_type_attribute(self, value):
        if value:
            return value
        raise serializers.ValidationError("Invalid part_type_attribute")


class PartTypeAttributeDisplaySerializer(serializers.ModelSerializer):
    options = AttributeOptionsSerializer(many=True)

    class Meta:
        model = PartTypeAttribute
        fields = '__all__'


class PartTypeDisplaySerializer(serializers.ModelSerializer):
    attributes = PartTypeAttributeDisplaySerializer(many=True)
    synonyms = PartTypeSynonymSerializer(many=True)

    class Meta:
        model = PartType
        fields = '__all__'


# whole Framework serializer
class FrameworkSerializer(serializers.ModelSerializer):
    partTypes = PartTypeDisplaySerializer(many=True)

    class Meta:
        model = PartSection
        fields = ('id', 'name', 'placing', 'partTypes')
