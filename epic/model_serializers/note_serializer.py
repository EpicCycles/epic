from django.contrib.auth.models import User
from rest_framework import serializers

from epic.models.note_models import CustomerNote


class CustomerNoteSerializer(serializers.ModelSerializer):
    quote = serializers.StringRelatedField(many=False)
    class Meta:
        model = CustomerNote
        fields = ('customer', 'note_text', 'customer_visible', 'created_date', 'created_by', 'quote')

    def to_representation(self, obj):
        data = super(CustomerNoteSerializer, self).to_representation(obj)
        if data['created_by']:
            userCreatedBy = User.objects.get(id=data['created_by'])
            created_by = str(userCreatedBy)
            data['created_by'] = created_by
        else:
            data['created_date'] = 'unknown'
        return data