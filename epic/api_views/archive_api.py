from requests import Response
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from epic.models.brand_models import Part
from epic.models.quote_models import QuotePart


class Archive(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    def post(self, request, archiveType):
        if archiveType == 'parts':
            for part in Part.objects.filter(standard=False):
                if not QuotePart.objects.filter(part=part).exists():
                    part.delete()

            return Response(status=status.HTTP_200_OK)

        return Response(status=status.HTTP_400_BAD_REQUEST, data='No archive rules for {0}'.format(archiveType))
