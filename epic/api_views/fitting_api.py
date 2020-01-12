from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.customer_serializer import FittingSerializer
from epic.models.customer_models import Fitting
from epic.models.quote_models import Quote


class FittingList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FittingSerializer

    def get_queryset(self):
        customer_id = self.request.query_params.get('customer_id', None)
        return fitting_data(customer_id)

    def get(self, request):
        """
        Returns a JSON response with a listing of course objects
        """
        customer_id = self.request.query_params.get('customer_id', None)
        return Response(self.get_queryset())

    def post(self, request):
        serializer = FittingSerializer(data=request.data)
        if serializer.is_valid():
            fitting = serializer.save()
            customer_id = serializer.data['customer']
            return Response(fitting_data(customer_id), status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def fitting_data(customer_id):
    fittings = Fitting.objects.filter(customer=customer_id)
    serializer = FittingSerializer(fittings, many=True)
    return serializer.data


class FittingMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

    serializer_class = FittingSerializer

    def get_object(self, pk):
        try:
            return Fitting.objects.get(pk=pk)
        except Fitting.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        fitting = self.get_object(pk)
        serializer = FittingSerializer(fitting)
        return Response(serializer.data)

    def post(self, request, pk):
        fitting = self.get_object(pk)
        customer_id = fitting.customer
        serializer = FittingSerializer(fitting, data=request.data)
        if serializer.is_valid():
            fitting = serializer.save()
            return Response(fitting_data(customer_id))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        fitting = self.get_object(pk)
        if not Quote.objects.filter(fitting=fitting).exists():
            customer_id = fitting.customer
            fitting.delete()
            return Response(fitting_data(customer_id))

        return Response(status=status.HTTP_403_FORBIDDEN)
