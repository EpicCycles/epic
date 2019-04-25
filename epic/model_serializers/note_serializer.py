from rest_framework import serializers

from epic.models.note_models import CustomerNote


class CustomerNoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerNote
        fields = '__all__'
