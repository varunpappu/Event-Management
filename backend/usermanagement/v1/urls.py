from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

from usermanagement.v1.views import CreateUserProfile

urlpatterns = [
    path('v1/user/register', CreateUserProfile.as_view(), name="user-register"),
    path('v1/user/login', TokenObtainPairView.as_view(), name='token-pair'),
    path('v1/user/token/refresh', TokenRefreshView.as_view(), name='token-refresh'),
]
