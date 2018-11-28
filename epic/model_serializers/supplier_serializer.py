from rest_framework import serializers

from epic.models.brand_models import Brand, Supplier


class SupplierSerializer(serializers.ModelSerializer):
    brand_names = serializers.SerializerMethodField()

    class Meta:
        model = Supplier
        fields = '__all__'

    def get_brand_names(self, supplier):
        brand_names = []
        for brand in Brand.objects.filter(supplier=supplier):
            brand_names.append(str(brand))
        return brand_names

    def validate_supplier_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing supplier name")
