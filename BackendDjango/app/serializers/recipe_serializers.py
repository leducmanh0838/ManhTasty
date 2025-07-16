# $2b$12$TnXtymwOk7ulvysq64y49.hf.Cu4j2eGwdWkA4tzc47krCumxI5ZW

from rest_framework import serializers
from app.models import Recipe, Ingredient, Step, Tag


class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['name', 'quantity']


class StepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['order', 'description', 'image']

class TagFieldSerializer(serializers.PrimaryKeyRelatedField):
    def to_internal_value(self, value):
        tag, created = Tag.objects.get_or_create(name=value.strip())
        return tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']

class RecipeSerializer(serializers.ModelSerializer):
    tags = TagFieldSerializer(many=True,queryset=Tag.objects.all(), write_only=True)
    tags_display = TagSerializer(many=True, read_only=True, source='tags')  # dùng để trả về

    ingredients = IngredientSerializer(many=True)
    steps = StepSerializer(many=True)

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'image',
                  'tags', 'tags_display',
                  'ingredients', 'steps']

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        steps_data = validated_data.pop('steps')
        tags_data = validated_data.pop('tags')

        recipe = Recipe.objects.create(author=self.context['request'].user, **validated_data)

        # Gán tag (đã là instance)
        recipe.tags.set(tags_data)

        for ingredient in ingredients_data:
            Ingredient.objects.create(recipe=recipe, **ingredient)
        for step in steps_data:
            Step.objects.create(recipe=recipe, **step)

        return recipe

