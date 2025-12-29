from django.urls import path
from core import routing as core_routing

websocket_urlpatterns = [
    *core_routing.websocket_urlpatterns,
]
