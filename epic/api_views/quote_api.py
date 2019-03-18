from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.quote_serializer import QuoteSerializer
from epic.models.bike_models import Frame
from epic.models.quote_models import Quote


class QuotesApi(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    serializer_class = QuoteSerializer
    
    def get_queryset(self):
        search_customer = self.request.query_params.get('partType', None)
        search_brand = self.request.query_params.get('brand', None)
        search_name = self.request.query_params.get('frameName', None)
        search_bike = self.request.query_params.get('bike', None)
        q = Quote.objects.all()

        if search_customer:
            q = q.filter(customer__id=search_customer)
        if search_bike:
            q = q.filter(bike__id=search_bike)
        else:
            q_frames = Frame.objects.all()
            if search_brand:
                q_frames = q_frames.filter(brand__id=search_brand)

            # if filter added on name add it to query set
            if search_name:
                q_frames = q_frames.filter(frame_name__icontains=search_name)

            q = q.filter(bike__frame__in=q_frames)

        # if filter added on name add it to query set
        if search_name:
            q = q.filter(part_name__icontains=search_name)

        return q

    def get(self, request):

        quotes = self.get_queryset()
        quote_serializer = QuoteSerializer(quotes, many=True)
        return Response(quote_serializer.data)
