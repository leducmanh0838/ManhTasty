from rest_framework import viewsets, mixins
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import Recipe, RecipeStatus
from app.paginations import RecipePagination
from app.serializers.recipe_serializers import RecipeBasicSerializer, RecipeSummarySerializer
from app.utils.mongodb import get_user_search_keywords


class UserRecipesViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    # permission_classes = [IsAuthenticated]
    pagination_class = RecipePagination

    def get_serializer_class(self):
        level = self.request.query_params.get('level', 'basic')
        if level == 'summary':
            return RecipeSummarySerializer
        return RecipeBasicSerializer

    # def get_queryset(self):
    #     # Trả về queryset món ăn của user hiện tại
    #     user_id = self.kwargs['user_pk']
    #     return Recipe.objects.filter(author_id=user_id)
    def get_queryset(self):
        user_id = self.kwargs['user_pk']
        qs = Recipe.objects.filter(author_id=user_id).order_by("-id")

        # Nếu user không phải owner hoặc chưa login
        if not self.request.user.is_authenticated or self.request.user.id != int(user_id):
            qs = qs.filter(status=RecipeStatus.ACTIVE)  # chỉ show active

        return qs