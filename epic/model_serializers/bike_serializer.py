from rest_framework import serializers

from epic.models.bike_models import Frame, BikePart, Bike

class BikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bike
        fields = '__all__'


class FrameSerializer(serializers.ModelSerializer):
    brand_name = serializers.SerializerMethodField()
    bikes=BikeSerializer(many=True)

    class Meta:
        model = Frame
        fields = '__all__'

    def get_brand_name(self, frame):
        brand = frame.brand
        return brand.brand_name


class BikePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BikePart
        fields = '__all__'

