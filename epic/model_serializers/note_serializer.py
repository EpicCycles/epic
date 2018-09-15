from django.contrib.auth.models import User
from rest_framework import serializers

from epic.models import CustomerNote


class CustomerNoteSerializer(serializers.ModelSerializer):
    quote = serializers.StringRelatedField(many=False)
    class Meta:
        model = CustomerNote
        fields = ('customer', 'note_text', 'customer_visible', 'created_on', 'created_by', 'quote')

    def to_representation(self, obj):
        data = super(CustomerNoteSerializer, self).to_representation(obj)
        created_by = str(User.objects.get(id=data['created_by']))
        data['created_by'] = created_by
        return data