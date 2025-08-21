from rest_framework import viewsets, mixins
from rest_framework.decorators import action

from app.models import Recipe, RecipeStatus
from app.paginations import RecipePagination
from app.serializers.recipe_serializers.recipe_serializers import RecipeBasicSerializer, RecipeSummarySerializer, \
    RecipeSummaryType2Serializer


class UserRecipesViewSet(viewsets.GenericViewSet, mixins.ListModelMixin):
    # permission_classes = [IsAuthenticated]
    pagination_class = RecipePagination

    def get_serializer_class(self):
        level = self.request.query_params.get('level', 'basic')
        if level == 'summary':
            return RecipeSummarySerializer
        if level == 'summary-type2':
            return RecipeSummaryType2Serializer
        return RecipeBasicSerializer


    def get_queryset(self):
        user_id = self.kwargs['user_pk']
        qs = Recipe.objects.filter(author_id=user_id).order_by("-id")
        # deleted = self.request.query_params.get('deleted')
        status = self.request.query_params.get('status')

        # Nếu user không phải owner hoặc chưa login
        if not self.request.user.is_authenticated or self.request.user.id != int(user_id):
            # User khác hoặc chưa login: chỉ show ACTIVE
            qs = qs.filter(status=RecipeStatus.ACTIVE)
        else:
            # Owner: chỉ loại bỏ DELETED
            if status:
                qs = qs.filter(status=int(status))
            else:
                qs = qs.exclude(status=RecipeStatus.DELETED)

        return qs