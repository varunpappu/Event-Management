from __future__ import unicode_literals

from django.db import models

from rootmodel.basemodel import BaseAbstractModel
from usermanagement.v1.models import UserProfile


class EventCreation(BaseAbstractModel):
    eventName = models.CharField(max_length=250, blank=True)
    isEventNameRequired = models.BooleanField(default=False)

    description = models.TextField()
    isDescriptionRequired = models.BooleanField(default=False)

    duration = models.CharField(max_length=250, blank=True)
    isDurationRequired = models.BooleanField(default=False)

    location = models.CharField(max_length=250, blank=True)
    isLocationRequired = models.BooleanField(default=False)

    fees = models.CharField(max_length=250, blank=True)
    isFeesRequired = models.BooleanField(default=False)

    tags = models.TextField()
    isTagsRequired = models.BooleanField(default=False)

    maxParticipants = models.CharField(max_length=250, blank=True)
    isMaxParticipantsRequired = models.BooleanField(default=False)

    userProfile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)

    class Meta:
        db_table: "EventCreation"


class EventParticipant(BaseAbstractModel):
    participants = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    eventId = models.ForeignKey(EventCreation, on_delete=models.CASCADE)
    eventName = models.CharField(max_length=250, blank=True)
    description = models.TextField()
    duration = models.CharField(max_length=250, blank=True)
    location = models.CharField(max_length=250, blank=True)
    fees = models.CharField(max_length=250, blank=True)
    tags = models.TextField()
    maxParticipants = models.CharField(max_length=250, blank=True)

    class Meta:
        db_table: "EventParticipant"
