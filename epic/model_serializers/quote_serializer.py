from rest_framework import serializers

from epic.models.quote_models import Quote, Charge, Question


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class ChargeSerializer(serializers.ModelSerializer):
    can_be_deleted = serializers.SerializerMethodField()

    class Meta:
        model = Charge
        fields = '__all__'

    def get_can_be_deleted(self, charge):
        return False

    def validate(self, data):
        charge_name = data.get('charge_name')
        existing_charges = Charge.objects.filter(charge_name__iexact=charge_name)
        if self.instance:
            existing_charges = existing_charges.exclude(id=self.instance.id)

        if existing_charges.exists():
            raise serializers.ValidationError('This charge is already set up')
        return data

    def validate_charge_name(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing name")


class QuestionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Question
        fields = '__all__'

    def validate(self, data):
        question = data.get('question')
        existing_questions = Question.objects.filter(question__iexact=question)
        if self.instance:
            existing_questions = existing_questions.exclude(id=self.instance.id)

        if existing_questions.exists():
            raise serializers.ValidationError('This question is already set up')
        return data

    def validate_question(self, value):
        if value:
            return value
        raise serializers.ValidationError("Missing question text")
