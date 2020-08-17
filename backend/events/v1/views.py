from django.db.models import Q
from django.shortcuts import get_object_or_404
from rest_framework import filters
from rest_framework import status, generics
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

from common.helpers import response_builder, has_valid_uuid, get_user_id
from events.v1.models import EventCreation, EventParticipant
from events.v1.serializers import EventSerializer, ListEventSerializer, ListEventInfoSerializer, \
    EventParticipateSerializer, ListEventParticipantsSerializer


class CreateEvent(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        user_instance = get_user_id(request)
        serializer = EventSerializer(data=request.data, context={"user_id": user_instance})
        if serializer.is_valid(raise_exception=True):
            serializer.save()

        return response_builder(status.HTTP_201_CREATED, "SUCCESS", ["Successfully created."])


class ListEvents(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    allowed_model_type = ['eventName', 'location', 'fees', 'tags', 'maxParticipants']

    queryset = EventCreation.objects.all()
    serializer_class = ListEventSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = allowed_model_type
    search_fields = allowed_model_type
    ordering = ['eventName']
    pagination_class = PageNumberPagination

    def get_queryset(self, *args, **kwargs):
        user_instance = get_user_id(self.request)
        queryset = EventCreation.objects.filter(userProfile=user_instance)
        page_size = self.kwargs.get('page_size')
        if page_size is None or not isinstance(page_size, int):
            page_size = 10
        self.pagination_class.page_size = page_size
        return queryset


class EventActions(APIView):
    permission_classes = (IsAuthenticated,)

    @has_valid_uuid()
    def get(self, request, _id):
        instance = get_object_or_404(EventCreation.objects.all(), _objectId=_id)
        serializer = ListEventSerializer(instance)
        return response_builder(status.HTTP_200_OK, "SUCCESS", serializer.data)

    @has_valid_uuid()
    def put(self, request, _id):
        instance = get_object_or_404(EventCreation.objects.all(), _objectId=_id)
        serializer = EventSerializer(instance, request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return response_builder(status.HTTP_200_OK, "SUCCESS", ["Successfully updated."])

    @has_valid_uuid()
    def delete(self, request, _id):
        instance = get_object_or_404(EventCreation.objects.all(), _objectId=_id)
        instance.delete()
        return response_builder(status.HTTP_200_OK, "SUCCESS", ["Successfully deleted."])


class ParticipableEvents(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    allowed_model_type = ['eventName', 'location', 'duration', 'fees', 'maxParticipants']

    queryset = EventCreation.objects.all()
    serializer_class = ListEventSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = allowed_model_type
    search_fields = allowed_model_type
    ordering = ['eventName']
    pagination_class = PageNumberPagination

    def get_queryset(self, *args, **kwargs):
        user_instance = get_user_id(self.request)
        queryset = EventCreation.objects.filter(~Q(userProfile=user_instance))
        page_size = self.kwargs.get('page_size')
        if page_size is None or not isinstance(page_size, int):
            page_size = 10
        self.pagination_class.page_size = page_size
        return queryset


class ParticipableEventInfo(APIView):
    permission_classes = (IsAuthenticated,)

    @has_valid_uuid()
    def get(self, request, _id):
        instance = get_object_or_404(EventCreation.objects.all(), _objectId=_id)
        serializer = ListEventInfoSerializer(instance)
        return response_builder(status.HTTP_200_OK, "SUCCESS", serializer.data)


class ParticipateEvent(APIView):
    permission_classes = (IsAuthenticated,)

    @has_valid_uuid()
    def post(self, request, _id):
        event_instance = get_object_or_404(EventCreation.objects.all(), _objectId=_id)
        user_instance = get_user_id(self.request)
        serializer = EventParticipateSerializer(data=request.data, context={
            "event_instance": event_instance, "user_instance": user_instance
        })
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return response_builder(status.HTTP_200_OK, "SUCCESS", ["Successfully created"])


class EventParticipants(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)

    allowed_model_type = ['eventName', 'location', 'fees', 'maxParticipants']

    queryset = EventParticipant.objects.all()
    serializer_class = ListEventParticipantsSerializer
    filter_backends = [filters.OrderingFilter, filters.SearchFilter]
    ordering_fields = allowed_model_type
    search_fields = allowed_model_type
    ordering = ['eventName']
    pagination_class = PageNumberPagination

    def get_queryset(self, *args, **kwargs):
        event_instance = get_object_or_404(EventCreation.objects.all(),
                                           _objectId=self.kwargs.get('_id'))
        queryset = EventParticipant.objects.filter(eventId=event_instance)
        page_size = self.kwargs.get('page_size')
        if page_size is None or not isinstance(page_size, int):
            page_size = 10
        self.pagination_class.page_size = page_size
        return queryset
