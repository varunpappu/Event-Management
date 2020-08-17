import uuid

from django.db import models


class BaseAbstractModel(models.Model):
    pkid = models.BigAutoField(primary_key=True, editable=False)
    _objectId = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    is_deleted = models.BooleanField(default=False)

    def soft_delete(self):
        self.is_deleted = True
        self.save()

    class Meta:
        abstract = True
        ordering = ['-created_at']
