from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import Recipe
from app.serializers.recipe_serializers import RecipeBasicSerializer, RecipeSummarySerializer
from app.utils.mongodb import get_user_search_keywords


class CurrentUserSearchViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='recent-keywords')
    def get_search_keywords(self, request):
        user = request.user
        return Response(get_user_search_keywords(user))
