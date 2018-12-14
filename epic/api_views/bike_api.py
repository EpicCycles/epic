from django.db.models import Q
from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_helpers.part_helper import find_or_create_part
from epic.model_serializers.bike_serializer import FrameSerializer, BikeSerializer
from epic.model_serializers.part_serializer import PartSerializer
from epic.models.bike_models import Frame, BikePart, Bike
from epic.models.brand_models import Brand
from epic.models.framework_models import PartType


class Frames(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def get_object(self, pk):
        try:
            return Frame.objects.get(id=pk)
        except Frame.DoesNotExist:
            raise Http404

    def get_queryset(self):
        search_name = self.request.query_params.get('frameName', None)
        search_brand = self.request.query_params.get('brand', None)
        include_archived = self.request.query_params.get('archived', None)
        q = Frame.objects.all()
        if search_brand:
            q = q.filter(brand__id=search_brand)

        # if filter added on name add it to query set
        if search_name:
            q = q.filter(frame_name__icontains=search_name)

        if include_archived == 'true':
            return q

        return q.filter(archived=False)

    def get(self, request, format=None):
        serializer = FrameSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def patch(self, request, pk):
        print(pk, request.data)
        frame = self.get_object(pk)
        print("existing frame", frame)
        serializer = FrameSerializer(frame, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FrameUpload(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def post(self, request, format=None):
        post_data = request.data
        return_data = []
        errors = False

        # first create the frame
        serializer = FrameSerializer(data=post_data)
        frame_brand = post_data.get('brand', None)
        frame_name = post_data.get('frame_name', None)
        existing_frame = Frame.objects.filter(brand=frame_brand, frame_name__upper=frame_name, archived=False).first()
        if existing_frame and existing_frame.archived_date:
            return Response(serializer.data, status=status.HTTP_409_CONFLICT)

        savedFrameData = None
        if existing_frame:
            savedFrameData = FrameSerializer(existing_frame).data
        elif serializer.is_valid():
            serializer.save()
            savedFrameData = serializer.data

        if savedFrameData:
            frame_id = savedFrameData.get('id', None)
            bikes = post_data.get('bikes', [])
            persisted_bikes = []
            for bike in bikes:
                bike['frame'] = frame_id
                model_name = bike.get('model_name')
                bikeSerializer = BikeSerializer(data=bike)
                existing_bike = Bike.objects.filter(frame__id=frame_id, model_name=model_name)
                if existing_bike:
                    bikeSerializer = BikeSerializer(instance=existing_bike, data=bike)
                    BikePart.objects.filter(bike=existing_bike).delete()

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
                        if part_type and part_name and bike_id:
                            part = find_or_create_part(Brand.objects.get(id=part_brand),
                                                       PartType.objects.get(id=part_type), part_name)
                            persisted_parts.append(PartSerializer(part).data)
                            bike_part = BikePart.objects.create(bike=Bike.objects.get(id=bike_id), part=part)
                            bike_part.save()
                    persisted_bike['parts'] = persisted_parts
                    persisted_bikes.append(persisted_bike)
                else:
                    bike['error'] = True
                    errors = True
                    bike['error_detail'] = bikeSerializer.errors
                    persisted_bikes.append(bike)

            savedFrameData['bikes'] = persisted_bikes
            if (errors):
                savedFrameData['error'] = True
                return Response(savedFrameData, status=status.HTTP_202_ACCEPTED)

            return Response(savedFrameData, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BikeList(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BikeSerializer
