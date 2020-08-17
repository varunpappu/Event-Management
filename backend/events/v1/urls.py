from django.urls import path

from events.v1.views import *

urlpatterns = [
    path('v1/event-management/event', CreateEvent.as_view(), name="create-event"),
    path('v1/event-management/event-list/<int:page_size>', ListEvents.as_view(), name="list-events"),
    path('v1/event-management/events/<_id>', EventActions.as_view(), name="event-actions"),

    path('v1/event-management/participable-events/<int:page_size>', ParticipableEvents.as_view(),
         name="participable-events"),
    path('v1/event-management/events/<_id>/info', ParticipableEventInfo.as_view(),
         name="participable-event-info"),

    path('v1/event-management/events/<_id>/participate', ParticipateEvent.as_view(), name="event-participate"),
    path('v1/event-management/event-participants/<_id>/participants/<int:page_size>', EventParticipants.as_view(),
         name="event-participants"),

]
