from django.db.models import F, Count
from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response

from app.models import RecipeReview, Recipe
from app.paginations import CommonPagination
from app.permissions import IsReviewOwner
from app.serializers.recipe_serializers.recipe_review_serializers import ReviewSerializer


class RecipeReviewViewSet(mixins.CreateModelMixin,
                          mixins.ListModelMixin,
                          # mixins.UpdateModelMixin,
                          viewsets.GenericViewSet):
    serializer_class = ReviewSerializer
    pagination_class = CommonPagination

    def get_queryset(self):
        queryset = RecipeReview.objects.all()
        recipe_id = self.kwargs.get("recipe_pk")  # lấy từ URL (nếu dùng nested router)
        if recipe_id:
            queryset = queryset.filter(recipe_id=recipe_id).order_by("-id")
        return queryset

    def get_permissions(self):
        if self.action in ["create", 'my_review']:
            return [IsAuthenticated()]  # chỉ create mới cần đăng nhập
        return [AllowAny()]  # các action khác ai cũng được

    def perform_create(self, serializer):
        recipe_id = self.kwargs['recipe_pk']
        recipe = Recipe.objects.get(pk=recipe_id)

        # if RecipeReview.objects.filter(user=self.request.user, recipe_id=recipe_id).exists():
        #     raise ValidationError("User đã đánh giá món ăn này rồi.")

        # tăng view_count
        # recipe.rating_sum = F("view_count") + 1
        # recipe.save(update_fields=["view_count"])
        # recipe.refresh_from_db(fields=["view_count"])

        serializer.save(
            user=self.request.user,
            recipe=recipe
        )

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request, *args, **kwargs):
        recipe_id = kwargs.get('recipe_pk')  # lấy từ kwargs
        print("recipe_id: ", recipe_id)
        stats = RecipeReview.objects.filter(recipe_id=recipe_id).values("rating").annotate(count=Count("id"))

        # Chuẩn hóa từ 1 → 5 sao, nếu không có thì = 0
        result = {str(i): 0 for i in range(1, 6)}
        for item in stats:
            result[str(item["rating"])] = item["count"]

        return Response(result)

    @action(detail=False, methods=["get"], url_path="my-review")
    def my_review(self, request, *args, **kwargs):
        """Lấy review của chính user cho recipe pk"""
        recipe_id = kwargs.get('recipe_pk')
        review = RecipeReview.objects.filter(recipe_id=recipe_id, user=request.user).first()
        if review:
            return Response(ReviewSerializer(review).data)
        return Response(None)

class ReviewViewSet(mixins.UpdateModelMixin,
                          viewsets.GenericViewSet):
    queryset = RecipeReview.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [IsAuthenticated, IsReviewOwner]