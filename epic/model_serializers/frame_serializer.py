from rest_framework import serializers

from epic.models.bike_models import Frame, BikePart, FrameExclusion


class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'


class FramePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = BikePart
        fields = '__all__'


class FrameExclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameExclusion
        fields = '__all__'

