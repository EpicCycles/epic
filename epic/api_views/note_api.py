from django.db.models import Q
from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.note_serializer import CustomerNoteSerializer
from epic.models.note_models import CustomerNote


class CustomerNoteList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerNoteSerializer

    def get_queryset(self):
        search_customer = self.request.query_params.get('customerId', None)
        search_quote = self.request.query_params.get('quoteId', None)
        customer_visible = self.request.query_params.get('customerVisible', False)
        # define an empty search pattern
        where_filter = Q()

        # if filter added on first name add it to query set
        if search_customer:
            where_filter &= Q(customer__id=search_customer)

        # if filter added on last name add it to query set
        if search_quote:
            where_filter &= Q(quote__id=search_quote)

        # if filter added for just customer visible add it to query set
        if search_quote:
            where_filter &= Q(customer_visible=customer_visible)

        # find objects matching any filter and order them
        objects = CustomerNote.objects.filter(where_filter).order_by('created_date')
        return objects

    def post(self, request):
        user = request.user
        serializer = CustomerNoteSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(created_by=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CustomerNoteMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomerNoteSerializer

    def get_object(self, pk):
        try:
            return CustomerNote.objects.get(pk=pk)
        except CustomerNote.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        customer_note = self.get_object(pk)
        serializer = CustomerNoteSerializer(customer_note)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, pk):
        customer_note = self.get_object(pk)
        serializer = CustomerNoteSerializer(customer_note, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_202_ACCEPTED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        customer_note = self.get_object(pk)
        customer_note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
