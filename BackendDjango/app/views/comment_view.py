from requests import Response
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from app.models import Comment, CommentStatus
from app.paginations import CommentPagination
from app.serializers.comment_serializers import StoreCommentCreateSerializer, ChildCommentSerializer


class CommentViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Comment.objects.all()
    serializer_class = ChildCommentSerializer
    pagination_class = CommentPagination

    @action(detail=True, methods=['get'], url_path='replies')
    def get_replies(self, request, pk=None):
        parent_comment = self.get_object()
        replies = parent_comment.replies.filter(status=CommentStatus.ACTIVE).order_by(
            '-id')  # hoặc '-created_at' nếu muốn

        page = self.paginate_queryset(replies)
        if page is not None:
            serializer = ChildCommentSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = ChildCommentSerializer(replies, many=True)
        return Response(serializer.data)
