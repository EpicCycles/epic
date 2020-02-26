from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.quote_serializer import QuestionSerializer
from epic.models.quote_models import Question


class QuestionList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = QuestionSerializer

    def get_queryset(self):
        """
        Returns a JSON response with a listing of course objects
        """
        return Question.objects.all()

    def get(self, request):
        return Response(question_data())

    def post(self, request):
        post_data = request.data

        serializer = QuestionSerializer(data=post_data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(question_data(), status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def question_data():
    questions = Question.objects.filter(deleted=False)
    serializer = QuestionSerializer(questions, many=True)
    return serializer.data


class QuestionMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuestionSerializer

    def get_object(self, question_id):
        try:
            return Question.objects.get(pk=question_id)
        except Question.DoesNotExist:
            raise Http404

    def get(self, request, question_id):
        question = self.get_object(question_id)
        serializer = QuestionSerializer(question)
        return Response(serializer.data)

    def post(self, request, question_id):
        question = self.get_object(question_id)
        serializer = QuestionSerializer(question, data=request.data)
        if serializer.is_valid():
            serializer.save(upd_by=request.user)
            return Response(question_data())

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, question_id):
        question = self.get_object(question_id)
        if question:
            question.deleted = True
            question.upd_by = request.user
            question.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)
