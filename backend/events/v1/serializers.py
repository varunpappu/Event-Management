from django.db.models import Q
from rest_framework import serializers

from common.helpers import error_messages
from events.v1.models import EventCreation, EventParticipant


class EventSerializer(serializers.Serializer):
    eventName = serializers.CharField(error_messages=error_messages())
    isEventNameRequired = serializers.NullBooleanField()

    description = serializers.CharField(error_messages=error_messages())
    isDescriptionRequired = serializers.NullBooleanField()

    duration = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'},
                                        min_value=0,
                                        max_value=24)
    isDurationRequired = serializers.NullBooleanField()

    location = serializers.CharField(error_messages=error_messages())
    isLocationRequired = serializers.NullBooleanField()

    fees = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'}, min_value=0,
                                    max_value=999999)
    isFeesRequired = serializers.NullBooleanField()

    tags = serializers.CharField(error_messages=error_messages())
    isTagsRequired = serializers.NullBooleanField()

    maxParticipants = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'}, min_value=0,
                                               max_value=1000)
    isMaxParticipantsRequired = serializers.NullBooleanField()

    def create(self, validated_data):
        validated_data['userProfile'] = self.context.get("user_id")
        event_instance = EventCreation.objects.create(**validated_data)
        return event_instance

    def update(self, instance, validated_data):
        instance.eventName = validated_data.get('eventName', instance.eventName)
        instance.jobDescription = validated_data.get('isEventNameRequired', instance.isEventNameRequired)
        instance.minSalary = validated_data.get('description', instance.description)
        instance.maxSalary = validated_data.get('isDescriptionRequired', instance.isDescriptionRequired)
        instance.totalVacancies = validated_data.get('duration', instance.duration)
        instance.department = validated_data.get('isDurationRequired', instance.isDurationRequired)
        instance.experience = validated_data.get('location', instance.location)
        instance.currency = validated_data.get('isLocationRequired', instance.isLocationRequired)
        instance.fees = validated_data.get('fees', instance.fees)
        instance.isFeesRequired = validated_data.get('isFeesRequired', instance.isFeesRequired)
        instance.tags = validated_data.get('tags', instance.tags)
        instance.isTagsRequired = validated_data.get('isTagsRequired', instance.isTagsRequired)
        instance.maxParticipants = validated_data.get('maxParticipants', instance.maxParticipants)
        instance.isMaxParticipantsRequired = validated_data.get('isMaxParticipantsRequired',
                                                                instance.isMaxParticipantsRequired)

        instance.save()

        return instance

    class Meta:
        fields = "__all__"


class ListEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCreation
        exclude = ("pkid", "is_deleted", "created_at", "updated_at", "userProfile")


class ListEventInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventCreation
        fields = (
            "_objectId", "isEventNameRequired", "isDescriptionRequired", "isDurationRequired", "isLocationRequired",
            "isFeesRequired",
            "isTagsRequired", "isMaxParticipantsRequired")


class EventParticipateSerializer(serializers.Serializer):

    def __init__(self, *args, **kwargs):
        event_instance = kwargs['context'].get('event_instance')
        if event_instance.isEventNameRequired == True:
            self.fields['eventName'].allow_blank = False
        if event_instance.isDescriptionRequired == True:
            self.fields['description'].allow_blank = False
        if event_instance.isDurationRequired == True:
            self.fields['duration'].allow_null = False
        if event_instance.isLocationRequired == True:
            self.fields['location'].allow_blank = False
        if event_instance.isFeesRequired == True:
            self.fields['fees'].allow_null = False
        if event_instance.isTagsRequired == True:
            self.fields['tags'].allow_blank = False
        if event_instance.isMaxParticipantsRequired == True:
            self.fields['maxParticipants'].allow_null = False
        super(EventParticipateSerializer, self).__init__(*args, **kwargs)

    eventName = serializers.CharField(error_messages=error_messages(), allow_blank=True)
    description = serializers.CharField(error_messages=error_messages(), allow_blank=True)
    duration = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'},
                                        min_value=0,
                                        max_value=24, allow_null=True)
    location = serializers.CharField(error_messages=error_messages(), allow_blank=True)
    fees = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'}, min_value=0,
                                    max_value=999999, allow_null=True)
    tags = serializers.CharField(error_messages=error_messages(), allow_blank=True)
    maxParticipants = serializers.IntegerField(error_messages={'invalid': 'A valid number is required.'}, min_value=0,
                                               max_value=1000, allow_null=True)

    def validate(self, attrs):
        event_instance = EventParticipant.objects.filter(
            Q(participants=self.context.get("user_instance")) & Q(eventId=self.context.get("event_instance")))
        if event_instance:
            raise serializers.ValidationError({"detail": "You have already registered for this event."})
        return attrs

    def create(self, validated_data):
        validated_data['participants'] = self.context.get("user_instance")
        validated_data['eventId'] = self.context.get("event_instance")
        print(validated_data)
        event_participants_instance = EventParticipant.objects.create(**validated_data)
        return event_participants_instance

    class Meta:
        model = EventParticipant
        fields = "__all__"


class ListEventParticipantsSerializer(serializers.ModelSerializer):
    participant = serializers.CharField(source="participants.user.first_name")

    class Meta:
        model = EventParticipant
        fields = ("participant", "eventName", "description", "duration", "location", "fees", "tags", "maxParticipants")
