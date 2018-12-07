from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_helpers.part_helper import find_or_create_part
from epic.model_serializers.bike_serializer import FrameSerializer, BikeSerializer
from epic.models.bike_models import Frame, BikePart


class Frames(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def get_queryset(self):
        return Frame.objects.all()
        brand = self.request.query_params.get('brand', None)
        search_name = self.request.query_params.get('frameName', None)
        includeArchived = self.request.query_params.get('archived', False)

        # define an empty search pattern
        where_filter = Q()

        # if filter added on name add it to query set
        if search_name:
            where_filter &= Q(frame_name__icontains=search_name)

        # if filter added on brand add it to query set
        if search_last_name:
            where_filter &= Q(brand=brand)
        # if filter includes archived frames
        if not includeArchived:
            where_filter &= Q(archived=False)

        # find objects matching any filter and order them
        objects = Frame.objects.filter(where_filter)
        return objects


    def get(self, request, format=None):
        serializer = FrameSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def post(self, request, format=None):
        post_data = request.data
        return_data = []
        errors = False

        # first create the frame
        serializer = FrameSerializer(data=post_data)
        frame_brand = post_data.get('brand', None)
        if serializer.is_valid():
            serializer.save()
            savedFrameData = serializer.data
            errors = False
            bikes = post_data.get('bikes', [])
            persisted_bikes = []
            for bike in bikes:
                bikeSerializer = BikeSerializer(data=bike)
                if bikeSerializer.is_valid():
                    bikeSerializer.save()
                    persisted_bike = bikeSerializer.data
                    bike_id = persisted_bike.get('id', None)
                    parts = bike.get('parts', [])
                    persisted_parts = []
                    for part in parts:
                        part_type = part.get('partType', None)
                        part_name = part.get('partName', None)
                        part_brand = part.get('brand', frame_brand)
                        if part_type and part_name:
                            part = find_or_create_part(part_brand, part_type, part_name)
                            bike_part = BikePart.objects.create(bike=bike_id, part=part)
                            bike_part.save()


                persisted_bikes.append(persisted_bike)
            else:
                bike['error'] = True
                errors = True
                bike['error_detail'] = bikeSerializer.errors
                persisted_bikes.append(bike)


            return Response(savedFrameData, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BikeList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BikeSerializer