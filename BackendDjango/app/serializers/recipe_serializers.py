# $2b$12$W12DhXaO.7RCDXCCYbS99u3PSknbT5XveQyc9xozSUTUtVznw1Ev.
from cloudinary.uploader import upload
from rest_framework import serializers
from app.models import Recipe, Ingredient, RecipeIngredient, Step, Tag
from app.utils.media import generate_public_id


class IngredientInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=100)
    quantity = serializers.CharField(max_length=100)

class TagInputSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=50)

class RecipeCreateSerializer(serializers.ModelSerializer):
    tags = serializers.JSONField(required=False)
    ingredients = serializers.JSONField(required=False)

    class Meta:
        model = Recipe
        fields = ['id','title', 'description','image', 'ingredients', 'tags', 'image']

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


    def create(self, validated_data):
        ingredients_data = validated_data.pop('ingredients')
        tags_data = validated_data.pop('tags')
        user = self.context['request'].user
        image_file = validated_data.pop('image', None)
        if image_file:
            # Upload thủ công để chỉ định public_id
            upload_result = upload(
                image_file,
                public_id=f"recipes/main_images/{generate_public_id()}"
            )
            validated_data['image'] = upload_result['public_id']

        # Tạo công thức
        recipe = Recipe.objects.create(author=user, **validated_data)


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

class RecipeListSerializer(serializers.ModelSerializer):
    ingredients = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'image', 'ingredients', 'tags']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # CloudinaryField tự sinh URL
        return None

    def get_ingredients(self, obj):
        return [ing.name for ing in obj.ingredients.all()[:3]]
        # return list(obj.ingredients.values_list('name', flat=True)[:3])
    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

class RecipeRetrieveSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField()
    ingredients = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    medias = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'image', 'author', 'ingredients', 'tags', 'medias']

    def get_author(self, obj):
        return obj.author.get_full_name()  # hoặc obj.author.full_name nếu bạn custom field

    # def get_ingredients(self, obj):
    #     return [ingredient.name for ingredient in obj.ingredients.all()]

    def get_ingredients(self, obj):
        recipe_ingredients = RecipeIngredient.objects.filter(recipe=obj).select_related('ingredient')
        return [
            {
                'name': ri.ingredient.name,
                'quantity': ri.quantity
            }
            for ri in recipe_ingredients
        ]

    def get_tags(self, obj):
        return [tag.name for tag in obj.tags.all()]

    def get_medias(self, obj):
        return [media.file.url for media in obj.medias.all().order_by('order')]