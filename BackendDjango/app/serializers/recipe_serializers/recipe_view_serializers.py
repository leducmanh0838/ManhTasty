# serializers.py
from rest_framework import serializers
from app.models import RecipeView

class RecipeViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeView
        fields = ["id", "recipe", "ip_address", "count", "created_at", "updated_at"]
        read_only_fields = ["ip_address", "count", "created_at", "updated_at"]