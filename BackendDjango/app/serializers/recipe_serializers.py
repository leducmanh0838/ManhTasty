# $2b$12$d.F2tugu9sBGCAS0WplbWOq4gg5MMwh6HX/XJKaOUYWI40l7/kExO
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
    # ingredients_input = IngredientInputSerializer(many=True, required=False)
    # steps_input = StepInputSerializer(many=True, required=False)
    # tags_input = TagInputSerializer(many=True, required=False)
    tags = serializers.JSONField(required=False)
    ingredients = serializers.JSONField(required=False)
    steps = serializers.JSONField(required=False)

    class Meta:
        model = Recipe
        fields = ['id','title', 'description','image', 'ingredients', 'steps', 'tags']

    def validate_tags(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Expected a list of tags")

        seen_names = set()
        unique_tags = []
        for item in value:
            name = item['name'].strip().lower()
            if name not in seen_names:
                seen_names.add(name)
                unique_tags.append(item)  # chỉ giữ lại tag đầu tiên

        serializer = TagInputSerializer(data=unique_tags, many=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def validate_ingredients(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Expected a list of ingredients")
        seen_names = set()
        for item in value:
            name = item['name'].strip().lower()
            if name in seen_names:
                raise serializers.ValidationError({"ingredients": f"Tên nguyên liệu trùng lặp: {item['name']}"})
            seen_names.add(name)
        if len(value)<3:
            raise serializers.ValidationError({"ingredients": "Số nguyên liệu phải lớn hơn hoặc bằng 3"})
        serializer = IngredientInputSerializer(data=value, many=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def validate_steps(self, value):
        if not isinstance(value, list):
            raise serializers.ValidationError("Expected a list of steps")

        serializer = StepInputSerializer(data=value, many=True)
        serializer.is_valid(raise_exception=True)
        return serializer.validated_data

    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        tags_data = validated_data.pop('tags')
        steps_data = validated_data.pop('steps')
        # validated_data.pop('author')
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

