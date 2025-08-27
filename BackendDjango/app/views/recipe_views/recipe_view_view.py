# from django.db.models import F
# from rest_framework import mixins, viewsets
# from rest_framework.exceptions import ValidationError
# from rest_framework.permissions import IsAuthenticated
#
# from app.models import Recipe
# from app.serializers.recipe_serializers.recipe_view_serializers import ViewSerializer
#
#
# class RecipeViewViewSet(mixins.CreateModelMixin,
#                     viewsets.GenericViewSet):
#     queryset = View.objects.all()
#     serializer_class = ViewSerializer
#     permission_classes = [IsAuthenticated]
#
#     def perform_create(self, serializer):
#         recipe_id = self.kwargs['recipe_pk']
#         recipe = Recipe.objects.get(pk=recipe_id)
#
#         if View.objects.filter(user=self.request.user, recipe_id=recipe_id).exists():
#             raise ValidationError("User đã xem món ăn này rồi.")
#
#         # tăng view_count
#         recipe.view_count = F("view_count") + 1
#         recipe.save(update_fields=["view_count"])
#         recipe.refresh_from_db(fields=["view_count"])
#
#         serializer.save(
#             user=self.request.user,
#             recipe=recipe
#         )
from datetime import timedelta
from django.utils import timezone
from django.db.models import F, Sum
from rest_framework import viewsets, status
from rest_framework.response import Response

from app.configs.rules import RecipeViewRule
from app.models import Recipe
from app.utils.mongo_db_utils.view_utils import add_or_update_view, get_total_views
from app.utils.other import get_client_ip


class RecipeViewViewSet(viewsets.ViewSet):

    def create(self, request, recipe_pk=None):
        ip = get_client_ip(request)

        add_or_update_view(recipe_pk, ip)
        # Tìm hoặc tạo record theo (recipe, ip_address)
        # obj, created = RecipeView.objects.get_or_create(
        #     recipe_id=recipe_pk,
        #     ip_address=ip,
        #     defaults={"count": 1},
        # )
        #
        # if not created:
        #     # Check cooldown
        #     now = timezone.now()
        #     cooldown = timedelta(seconds=RecipeViewRule.RECIPE_VIEW_COOLDOWN)
        #
        #     if now - obj.updated_at > cooldown:
        #         obj.count = F("count") + 1
        #         obj.save(update_fields=["count", "updated_at"])
        #         obj.refresh_from_db()
        #
        # total_views = RecipeView.objects.filter(recipe_id=recipe_pk).aggregate(
        #     total=Sum("count")
        # )["total"] or 0
        #
        # Recipe.objects.filter(pk=recipe_pk).update(view_count=total_views)
        #
        # serializer = RecipeViewSerializer(obj)
        count = get_total_views(recipe_pk)
        Recipe.objects.filter(pk=recipe_pk).update(view_count=get_total_views(recipe_pk))
        return Response({"count": count}, status=status.HTTP_200_OK)