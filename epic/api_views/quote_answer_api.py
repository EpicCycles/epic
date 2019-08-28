from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.note_helper import create_note_for_quote_answer
from epic.helpers.quote_helper import check_charges
from epic.model_serializers.quote_serializer import QuoteAnswerSerializer
from epic.models.quote_models import QuoteAnswer


class QuoteAnswerMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuoteAnswerSerializer

    def get_object(self, quote_answer_id):
        try:
            return QuoteAnswer.objects.get(id=quote_answer_id)
        except QuoteAnswer.DoesNotExist:
            raise Http404

    def post(self, request):
        user = request.user
        quote_answer_data = request.data
        serializer = QuoteAnswerSerializer(data=quote_answer_data)
        if serializer.is_valid():
            quote_answer = serializer.save()
            create_note_for_quote_answer(quote_answer, user, 'created')
            check_charges(user, quote_answer)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, quote_answer_id):
        user = request.user
        quote_answer = self.get_object(quote_answer_id)
        quote_answer_data = request.data
        serializer = QuoteAnswerSerializer(quote_answer, data=quote_answer_data)
        if serializer.is_valid():
            quote_answer = serializer.save()
            create_note_for_quote_answer(quote_answer, user, 'updated')
            check_charges(user, quote_answer)
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_answer_id):
        user = request.user
        quote_answer = self.get_object(quote_answer_id)
        create_note_for_quote_answer(quote_answer, user, 'deleted')
        quote_answer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
