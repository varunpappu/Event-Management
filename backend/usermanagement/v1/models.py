from django.contrib.auth.models import User
from django.db import models

from rootmodel.basemodel import BaseAbstractModel


class UserProfile(BaseAbstractModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    class Meta:
        db_table: "UserProfile"
