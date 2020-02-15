from django.http import Http404
from rest_framework import generics, status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from epic.model_serializers.bike_serializer import FrameSerializer, BikeSerializer, FrameListSerializer
from epic.models.bike_models import Frame, Bike
from epic.models.quote_models import Quote


class Frames(generics.ListCreateAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = FrameSerializer

    def get_object(self, frame_id):
        try:
            return Frame.objects.get(pk=frame_id)
        except Frame.DoesNotExist:
            raise Http404

    def get_queryset(self):
        search_frame_name = self.request.query_params.get('frameName', None)
        search_brand = self.request.query_params.get('brand', None)
        include_archived = self.request.query_params.get('archived', None)
        q = Frame.objects.all()
        if search_brand:
            q = q.filter(brand__id=search_brand)

        # if filter added on name add it to query set
        if search_frame_name:
            q = q.filter(frame_name__icontains=search_frame_name)

        if include_archived == 'true':
            return q

        return q.filter(archived=False)

    def get(self, request):
        frame_list = self.get_queryset()
        frame_serializer = FrameListSerializer(frame_list, many=True)

        bike_list = Bike.objects.filter(frame__in=frame_list)
        bike_serializer = BikeSerializer(bike_list, many=True)

        return Response({'frames': frame_serializer.data,
                         'bikes': bike_serializer.data})

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

    def post(self, request):
        post_data = request.data

        errors = False

        # first create the frame
        serializer = FrameSerializer(data=post_data)
        frame_brand = post_data.get('brand', None)
        frame_name = post_data.get('frame_name', None)
        existing_frame = Frame.objects.filter(brand=frame_brand, frame_name__iexact=frame_name, archived=False).first()
        if existing_frame and existing_frame.archived_date:
            return Response(serializer.data, status=status.HTTP_409_CONFLICT)

        saved_frame_data = None
        if existing_frame:
            saved_frame_data = FrameSerializer(existing_frame).data
        elif serializer.is_valid():
            serializer.save()
            saved_frame_data = serializer.data

        if saved_frame_data:
            frame_id = saved_frame_data.get('id', None)
            bikes = post_data.get('bikes', [])
            persisted_bikes = []
            for bike in bikes:
                bike['frame'] = frame_id
                model_name = bike.get('model_name')

                bike_serializer = BikeSerializer(data=bike)
                existing_bike = Bike.objects.filter(frame__id=frame_id, model_name=model_name).first()
                if existing_bike:
                    bike_serializer = BikeSerializer(existing_bike, data=bike)

                if bike_serializer.is_valid():
                    bike_serializer.save()
                    persisted_bike = bike_serializer.data
                    persisted_bikes.append(persisted_bike)
                else:
                    print(bike_serializer.errors)
                    bike['error'] = True
                    errors = True
                    bike['error_detail'] = bike_serializer.errors
                    persisted_bikes.append(bike)

            saved_frame_data['bikes'] = persisted_bikes
            if errors:
                saved_frame_data['error'] = True
                return Response(status=status.HTTP_202_ACCEPTED)

            return Response(status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def get_bike_object(bike_id):
    try:
        return Bike.objects.get(pk=bike_id)
    except Bike.DoesNotExist:
        raise Http404


def get_bike(bike_id):
    bike_serializer = BikeSerializer(get_bike_object(bike_id))
    return bike_serializer.data


class Bikes(generics.GenericAPIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)
    serializer_class = BikeSerializer

    def get(self, bike_id):
        return Response(get_bike(bike_id))

    def patch(self, request, bike_id):
        bike = get_bike_object(bike_id)
        serializer = BikeSerializer(bike, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(get_bike(bike_id))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, bike_id):
        bike = get_bike_object(bike_id)
        if not Quote.objects.filter(bike=bike).exists():
            bike.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)

        return Response(status=status.HTTP_403_FORBIDDEN)

