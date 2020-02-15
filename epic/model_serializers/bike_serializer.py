from rest_framework import serializers

from epic.models.bike_models import Frame, Bike


class BikeSerializer(serializers.ModelSerializer):
    frame_name = serializers.SerializerMethodField()
    class Meta:
        model = Bike
        fields = '__all__'

    def get_frame_name(self, bike):
        frame = bike.frame
        return str(frame)


class FrameListSerializer(serializers.ModelSerializer):
    brand_name = serializers.SerializerMethodField()

    class Meta:
        model = Frame
        fields = '__all__'

    def get_brand_name(self, frame):
        brand = frame.brand
        return brand.brand_name


class FrameSerializer(serializers.ModelSerializer):

    class Meta:
        model = Frame
        fields = '__all__'
