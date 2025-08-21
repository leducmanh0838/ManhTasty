from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType

from app.models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Notification
        fields = ['id', 'title', 'description', 'type', 'object_id', 'content_type']
