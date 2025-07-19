# # $2b$12$TnXtymwOk7ulvysq64y49.hf.Cu4j2eGwdWkA4tzc47krCumxI5ZW
#
# from rest_framework import serializers
# from app.models import Recipe, Ingredient, Step, Tag
#
#
# class IngredientSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Ingredient
#         fields = ['name', 'quantity']
#
#
# class StepSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Step
#         fields = ['order', 'description', 'image']
#
# class TagFieldSerializer(serializers.PrimaryKeyRelatedField):
#     def to_internal_value(self, value):
#         tag, created = Tag.objects.get_or_create(name=value.strip())
#         return tag
#
# class TagSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Tag
#         fields = ['id', 'name']
#
# class RecipeSerializer(serializers.ModelSerializer):
#     tags = TagFieldSerializer(many=True,queryset=Tag.objects.all(), write_only=True)
#     tags_display = TagSerializer(many=True, read_only=True, source='tags')  # dùng để trả về
#
#     ingredients = IngredientSerializer(many=True)
#     steps = StepSerializer(many=True)
#
#     class Meta:
#         model = Recipe
#         fields = ['id', 'title', 'description', 'image',
#                   'tags', 'tags_display',
#                   'ingredients', 'steps']
#
#     def create(self, validated_data):
#         ingredients_data = validated_data.pop('ingredients')
#         steps_data = validated_data.pop('steps')
#         tags_data = validated_data.pop('tags')
#
#         recipe = Recipe.objects.create(author=self.context['request'].user, **validated_data)
#
#         # Gán tag (đã là instance)
#         recipe.tags.set(tags_data)
#
#         for ingredient in ingredients_data:
#             Ingredient.objects.create(recipe=recipe, **ingredient)
#         for step in steps_data:
#             Step.objects.create(recipe=recipe, **step)
#
#         return recipe
#

import json
from rest_framework import serializers
from app.models import Recipe, Ingredient, RecipeIngredient, Step, Tag


class IngredientInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    quantity = serializers.CharField(max_length=100)

class StepInputSerializer(serializers.Serializer):
    order = serializers.IntegerField()
    description = serializers.CharField()

class TagInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)

class RecipeCreateSerializer(serializers.ModelSerializer):
    ingredients = IngredientInputSerializer(many=True, required=False)
    steps = StepInputSerializer(many=True, required=False)
    tags = TagInputSerializer(many=True, required=False)

    class Meta:
        model = Recipe
        fields = ['title', 'description','image', 'ingredients', 'steps', 'tags']

    def to_internal_value(self, data):
        # Sao chép dữ liệu để tránh mutation
        data = data.copy()
        for field in ['ingredients', 'steps', 'tags']:
            value = data.get(field)
            if isinstance(value, str):
                try:
                    data[field] = json.loads(value)
                except json.JSONDecodeError:
                    raise serializers.ValidationError({
                        field: ['Invalid JSON format']
                    })

        return super().to_internal_value(data)

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        tags_data = validated_data.pop('tags')
        steps_data = validated_data.pop('steps')
        user = self.context['request'].user

        # Tạo công thức
        recipe = Recipe.objects.create(author=user, **validated_data)

        for step_data in steps_data:
            Step.objects.create(recipe=recipe, **step_data)

        # Tạo nguyên liệu và liên kết
        for ingredient_data in ingredients_data:
            name = ingredient_data['name'].strip().lower()
            quantity = ingredient_data['quantity']

            ingredient, created = Ingredient.objects.get_or_create(name__iexact=name, defaults={'name': name})

            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=quantity
            )

        for tag_data in tags_data:
            name = tag_data['name'].strip().lower()
            tag, _ = Tag.objects.get_or_create(name__iexact=name, defaults={'name': name})
            recipe.tags.add(tag)

        return recipe

