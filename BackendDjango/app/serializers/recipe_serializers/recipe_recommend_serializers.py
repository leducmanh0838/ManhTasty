from rest_framework import serializers

from app.models import Recipe


class RecipeRecommendSerializer(serializers.ModelSerializer):
    ingredient_score = serializers.IntegerField()
    tag_score = serializers.IntegerField()
    total_score = serializers.IntegerField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'image', 'ingredient_score', 'tag_score', 'total_score']

    def get_image(self, obj):
        if hasattr(obj, 'image') and obj.image:
            return obj.image.url  # CloudinaryField tự sinh URL
        return None