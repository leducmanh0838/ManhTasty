from rest_framework import mixins, viewsets
from rest_framework.exceptions import ValidationError

from app.models import Ingredient
from app.paginations import CommonPagination
from app.serializers.ingredient_serializers import IngredientSerializer


class IngredientViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Ingredient.objects.all()
    serializer_class = IngredientSerializer
    pagination_class = CommonPagination
    def get_queryset(self):
        if self.action == 'list':
            queries = self.queryset
            keyword = self.request.query_params.get('keyword')
            if keyword:
                queries = queries.filter(name__icontains=keyword)
            else:
                raise ValidationError({"keyword": "This query parameter is required."})

            return queries