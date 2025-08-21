from rest_framework import mixins, viewsets

from app.models import Notification
from app.paginations import CommentPagination
from app.permissions import IsUserOwner
from app.serializers.notification_serializers import NotificationSerializer


class CurrentUserNotificationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    # queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsUserOwner]
    pagination_class = CommentPagination
    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-id")