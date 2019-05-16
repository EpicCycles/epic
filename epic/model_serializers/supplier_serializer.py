from rest_framework import serializers

from epic.models.brand_models import Brand, Supplier


class SupplierSerializer(serializers.ModelSerializer):

    class Meta:
        model = Supplier
        fields = '__all__'

    def validate_supplier_name(self, value):
        if value:
            existing_suppliers = Supplier.objects.filter(supplier_name__iexact=value)
            if self.instance:
                existing_suppliers.exclude(id=self.instance.id)
            if existing_suppliers.exists():
                raise serializers.ValidationError('This supplier is already set up')
            return value
        raise serializers.ValidationError("Missing supplier name")
