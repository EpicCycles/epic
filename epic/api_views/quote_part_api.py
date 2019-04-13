from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.helpers.note_helper import create_note_for_quote_part
from epic.model_serializers.quote_serializer import QuotePartSerializer
from epic.models.quote_models import QuotePart


class QuotePartMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuotePartSerializer
    
    def get_object(self, quote_part_id):
        try:
            return QuotePart.objects.get(id=quote_part_id)
        except QuotePart.DoesNotExist:
            raise Http404
        
    def post(self, request):
        user = request.user
        print(request.data)
        serializer = QuotePartSerializer(data=request.data)
        if serializer.is_valid():
            quote_part = serializer.save()
            create_note_for_quote_part(quote_part, user, 'created')
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, quote_part_id):
        user = request.user
        quote_part = self.get_object(quote_part_id)
        serializer = QuotePartSerializer(quote_part, data=request.data)
        if serializer.is_valid():
            quote_part = serializer.save()
            create_note_for_quote_part(quote_part, user, 'updated')
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, quote_part_id):
        user = request.user
        quote_part = self.get_object(quote_part_id)
        create_note_for_quote_part(quote_part, user, 'deleted')
        quote_part.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
