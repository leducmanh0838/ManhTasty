from rest_framework import serializers

from app.models import RecipeIngredient, Ingredient


class IngredientWithQuantitySerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(source='ingredient.id')
    name = serializers.CharField(source='ingredient.name')

    class Meta:
        model = RecipeIngredient  # Đây là model trung gian
        fields = ['id', 'name', 'quantity']


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient  # Đây là model trung gian
        fields = ['id', 'name']