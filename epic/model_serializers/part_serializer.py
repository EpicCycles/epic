from rest_framework import serializers

from epic.models.brand_models import Part, SupplierProduct, Bundle


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = '__all__'


class SupplierProductSerializer(serializers.ModelSerializer):
    bundle_names = serializers.SerializerMethodField()

    class Meta:
        model = SupplierProduct
        fields = '__all__'

    def get_bundle_names(self, supplier_product):
        return Bundle.objects.filter(supplier_product=supplier_product).values_list('bundle_name', flat=True)


class BundleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bundle
        fields = '__all__'

    def validate_bundle_name(self, value):
        if value:
            return value
        raise serializers.ValidationError('Missing bundle name')
