from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import mixins, viewsets
from rest_framework.decorators import action

from app.models import Notification
from app.paginations import CommentPagination
from app.permissions import IsUserOwner
from app.serializers.notification_serializers import NotificationSerializer


class CurrentUserNotificationViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    # queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CommentPagination

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by("-id")

    def list(self, request, *args, **kwargs):
        # Đánh dấu tất cả chưa đọc thành đã đọc
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return super().list(request, *args, **kwargs)

    @action(detail=False, methods=['get'], url_path='count')
    def get_unread_count(self, request):
        count = Notification.objects.filter(user=request.user, is_read=False).count()
        return Response({'count': count})

    @action(detail=False, methods=['post'], url_path='mark-unread')
    def mark_unread(self, request):
        count = Notification.objects.filter(user=request.user, is_read=True).update(is_read=False)
        return Response({'count': count})
