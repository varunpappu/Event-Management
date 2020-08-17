# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

# Register your models here.
from events.v1.models import EventCreation, EventParticipant
from django.contrib.sessions.models import Session

admin.site.register(EventCreation)
admin.site.register(EventParticipant)
admin.site.register(Session)