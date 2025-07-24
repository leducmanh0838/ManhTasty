# from rest_framework import mixins, viewsets
# from rest_framework.permissions import IsAuthenticated
# from app.models import Comment
# from app.serializers.comment_serializers import CommentSerializer
#
#
# class CommentViewSet(mixins.CreateModelMixin, mixins.ListModelMixin, viewsets.GenericViewSet):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer
#     permission_classes = [IsAuthenticated]
#
#     def get_queryset(self):
#         recipe_id = self.kwargs.get('recipe_pk')
#         return Comment.objects.filter(recipe_id=recipe_id).order_by('id')