from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from events.v1.models import EventCreation


@receiver(post_save, sender=EventCreation)
def announce_new_event(sender, instance, created, **kwargs):
    if  created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "notifications", {"type": "event.actions",
                              "event": "update",
                              "eventId": str(instance._objectId),
                              "message": "The following event " + instance.eventName + " has been updated"})


@receiver(post_delete, sender=EventCreation)
def announce_delete_event(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "notifications", {"type": "event.actions",
                          "event": "delete",
                          "message": "The following event " + instance.eventName + " has been deleted"})
