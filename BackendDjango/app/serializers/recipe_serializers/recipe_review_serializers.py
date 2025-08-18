from django.db.models import F, Sum, Count, Avg
from rest_framework import serializers

from app.models import RecipeReview, Recipe
from app.serializers.user_serializers import AvatarAndNameSerializer


class ReviewSerializer(serializers.ModelSerializer):
    user = AvatarAndNameSerializer(read_only=True)

    class Meta:
        model = RecipeReview
        fields = ["id", "recipe", "user", "rating", "comment", "created_at"]
        read_only_fields = ["recipe", "user", "created_at"]

    def validate_rating(self, value):
        """Đảm bảo số sao hợp lệ"""
        if not (1 <= value <= 5):
            raise serializers.ValidationError("Rating phải từ 1 đến 5 sao.")
        return value

    def create(self, validated_data):
        review = super().create(validated_data)
        self.update_recipe_rating(review.recipe)
        return review

    def update(self, instance, validated_data):
        review = super().update(instance, validated_data)
        self.update_recipe_rating(review.recipe)
        return review

    def update_recipe_rating(self, recipe):
        print("update_recipe_rating")
        agg = recipe.reviews.aggregate(
            rating_sum=Sum("rating"),  # tổng số sao
            rating_count=Count("id"),  # số lượt đánh giá
            rating_avg=Avg("rating")  # trung bình sao
        )

        recipe.rating_sum = agg["rating_sum"] or 0
        recipe.rating_count = agg["rating_count"] or 0
        recipe.save(update_fields=["rating_sum", "rating_count", "updated_at"])
