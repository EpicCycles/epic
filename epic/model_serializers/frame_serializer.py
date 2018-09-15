from rest_framework import serializers

from epic.models import Frame, FramePart, FrameExclusion


class FrameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Frame
        fields = '__all__'


class FramePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = FramePart
        fields = '__all__'


class FrameExclusionSerializer(serializers.ModelSerializer):
    class Meta:
        model = FrameExclusion
        fields = '__all__'

