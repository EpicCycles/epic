from rest_framework import serializers

from epic.models import Brand, Supplier


class BrandSerializer(serializers.ModelSerializer):
    supplier_names = serializers.SerializerMethodField()

    class Meta:
        model = Brand
        fields = '__all__'

    def get_supplier_names(self, brand):
        supplier_names = []
        for supplier in brand.supplier.all():
            supplier_names.append(str(supplier))
        return supplier_names

    def validate_brand_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing brand name")
