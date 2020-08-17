from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('public/', include('events.v1.urls')),
    path('public/', include('usermanagement.v1.urls')),
]
