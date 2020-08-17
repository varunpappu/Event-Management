from django.contrib import admin

# Register your models here.
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken

from usermanagement.v1.models import UserProfile

admin.site.register(UserProfile)
# admin.site.register(OutstandingToken)