from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import path

from events.consumer import EventConsumer

application = ProtocolTypeRouter({
    "websocket": URLRouter([
        path("notifications/", EventConsumer),
    ])
})