from rest_framework import serializers

from epic.models.quote_models import Quote, QuotePart, Charge, QuoteCharge, Question, QuoteAnswer


class QuoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quote
        fields = '__all__'


class QuotePartSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuotePart
        fields = '__all__'

    def validate(self, data):
        part = data.get('part')
        not_required = data.get('not_required')
        quantity = data.get('quantity')

        # if self.instance:
        #     if not quote:
        #         quote = self.instance.quote
        #
        # if quote.quote_status is '2':
        #     raise serializers.ValidationError("Quote part must be part of a current quote")

        if not (part or not_required):
            raise serializers.ValidationError("Quote part must either be a replacement part or include part details")
        if part:
            if not quantity:
                raise serializers.ValidationError("Parts must have a quantity")

        return data


class ChargeSerializer(serializers.ModelSerializer):
    can_be_deleted = serializers.SerializerMethodField()

    class Meta:
        model = Charge
        fields = '__all__'

    def get_can_be_deleted(self, charge):
        return not QuoteCharge.objects.filter(charge=charge).exists()

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


class QuoteChargeSerializer(serializers.ModelSerializer):
    can_be_zero = serializers.SerializerMethodField()
    class Meta:
        model = QuoteCharge
        fields = '__all__'

    def get_can_be_zero(self, quote_charge):
        return quote_charge.charge.can_be_zero


class QuoteAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteAnswer
        fields = '__all__'

