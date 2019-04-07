from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.quote_serializer import QuotePartSerializer


class QuotePartMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = QuotePartSerializer

    def post(self, request):
        user = request.user
        serializer = QuotePartSerializer(data=request.data)
        if serializer.is_valid():
            quote = serializer.save(created_by=user)
            create_note_for_new_quote(quote, user)
            return Response(quote_data_for_quote_or_customer(quote))

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

