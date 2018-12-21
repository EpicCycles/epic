from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_helpers.part_helper import find_or_create_part
from epic.model_serializers.bike_serializer import FrameSerializer, BikeSerializer, FrameListSerializer
from epic.model_serializers.part_serializer import PartSerializer
from epic.models.bike_models import Frame, BikePart, Bike
from epic.models.brand_models import Brand, Part
from epic.models.framework_models import PartType
from epic.models.quote_models import Quote


class Frames(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def get_object(self, frame_id):
        try:
            return Frame.objects.get(id=frame_id)
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
        serializer = FrameListSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)

    def patch(self, request, frame_id):
        frame = self.get_object(frame_id)
        serializer = FrameSerializer(frame, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, frame_id):
        frame = self.get_object(frame_id)
        if not Quote.objects.filter(bike__frame=frame).exists():
            frame.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)

class FrameUpload(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def post(self, request, format=None):
        post_data = request.data

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
                    bikeSerializer = BikeSerializer(existing_bike, data=bike)
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
                        part_brand = part.get('partBrand', frame_brand)
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
            if errors:
                savedFrameData['error'] = True
                return Response(savedFrameData, status=status.HTTP_202_ACCEPTED)

            return Response(savedFrameData, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class BikeMaintain(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BikeSerializer

    def get_object(self, bike_id):
        try:
            return Bike.objects.get(pk=bike_id)
        except Bike.DoesNotExist:
            raise Http404

    def get(self, request, bike_id):
        bike = self.get_object(bike_id)
        serializer = BikeSerializer(bike)
        return Response(serializer.data)

    def patch(self, request, bike_id):
        bike = self.get_object(bike_id)
        serializer = BikeSerializer(bike, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, bike_id):
        bike = self.get_object(bike_id)
        if not Quote.objects.filter(bike=bike).exists():
            bike.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)


class BikeParts(generics.ListCreateAPIView):
    # authentication_classes = (TokenAuthentication,)
    # permission_classes = (IsAuthenticated,)
    serializer_class = PartSerializer

    def get_object(self, bike_id, part_id):
        try:
            bike_parts =  BikePart.objects.filter(bike__id=bike_id, part__id=part_id)
            if bike_parts.exists():
                return bike_parts[0]
            raise Http404

        except BikePart.DoesNotExist:
            raise Http404

    def get_queryset(self):
        bike_id = self.kwargs['bike_id']
        raw_sql_1 = 'select * from epic_part where id in ( '
        raw_sql_2 = 'select part_id from epic_bikepart where bike_id = ' + str(bike_id)
        raw_sql_3 = ')'
        search_part_type = self.request.query_params.get('partType', None)

        if search_part_type:
            raw_sql_3 = ' and parttype_id = ' + str(search_part_type) + ')'
        # return q
        return Part.objects.raw(raw_sql_1 + raw_sql_2 + raw_sql_3)

    def get(self, request, bike_id):
        serializer = PartSerializer(self.get_queryset(), many=True)
        return Response(serializer.data)


    def post(self, request, bike_id):
        part_data = request.data

        part_type = part_data.get('partType', None)
        part_name = part_data.get('part_name', None)
        part_brand = part_data.get('brand', None)
        existing_bike = Bike.objects.get(id=bike_id)
        if part_type and part_name and part_brand:
            try:
                # get an existing part
                part = find_or_create_part(Brand.objects.get(id=part_brand),
                                           PartType.objects.get(id=part_type),
                                           part_name, True)
                BikePart.objects.filter(bike=existing_bike, part__partType__id=part_type).delete()
                bike_part = BikePart.objects.create(bike=existing_bike, part=part)
                bike_part.save()
                return Response(status=status.HTTP_202_ACCEPTED)
            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, bike_id, part_id):
        bike_part = self.get_object(bike_id, part_id)
        bike_part.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    def put(self, request, bike_id, part_id):
        bike_part = self.get_object(bike_id, part_id)
        part_data = request.data
        part_type = part_data.get('partType', None)
        part_name = part_data.get('part_name', None)
        part_brand = part_data.get('brand', None)
        if part_type and part_name and part_brand:
            try:
                # if a part already exists with a different id but these values then use that

                part = find_or_create_part(Brand.objects.get(id=part_brand),
                                       PartType.objects.get(id=part_type),
                                       part_name, False)
                if part:
                    bike_part.part = part
                    bike_part.save()
                else:
                    part = Part.objects.get(pk=part_id)

                partSerializer = PartSerializer(part, part_data)
                if partSerializer.is_valid():
                    partSerializer.save()
                    return Response(status=status.HTTP_202_ACCEPTED)

                return Response(partSerializer.errors, status=status.HTTP_400_BAD_REQUEST)

            except Exception:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        return Response(status=status.HTTP_400_BAD_REQUEST)



