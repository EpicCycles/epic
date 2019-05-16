from rest_framework import serializers

from epic.models.brand_models import Brand


class BrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = Brand
        fields = '__all__'

    def validate(self, data):
        brand_name = data.get('brand_name')
        existing_brands = Brand.objects.filter(brand_name__iexact=brand_name)
        if self.instance:
            existing_brands = existing_brands.exclude(id=self.instance.id)

        if existing_brands.exists():
            raise serializers.ValidationError('This brand is already set up')
        return data

    def validate_brand_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing brand name")
