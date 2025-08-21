# $2b$12$by56vaFDxvQie8qU3jFQ6ulNL4EUqZVp.alJr6TrW3YztwBA3wrSO
from cloudinary.utils import cloudinary_url
from rest_framework import serializers
from app.models import Recipe, Ingredient, RecipeIngredient, Step, Tag, MediaType, RecipeMedia, RecipeTag
from app.serializers.ingredient_serializers import IngredientWithQuantitySerializer, IngredientSerializer
from app.serializers.recipe_serializers.recipe_media_serializers import RecipeMediaSerializer
from app.serializers.step_serializers import StepListSerializer, StepListForRecipeOriginalSerializer
from app.serializers.tag_serializers import TagSerializer
from app.serializers.user_serializers import AvatarAndNameSerializer


# class IngredientInputSerializer(serializers.Serializer):
#     name = serializers.CharField(max_length=100)
#     quantity = serializers.CharField(max_length=100)
#
# class TagInputSerializer(serializers.Serializer):
#     name = serializers.CharField(max_length=50)
#
# class RecipeCreateSerializer(serializers.ModelSerializer):
#     tags = serializers.JSONField(required=False)
#     ingredients = serializers.JSONField(required=False)
#
#     class Meta:
#         model = Recipe
#         fields = ['id','title', 'description','image', 'ingredients', 'tags']
#
#     def validate_tags(self, value):
#         if not isinstance(value, list):
#             raise serializers.ValidationError("Expected a list of tags")
#
#         seen_names = set()
#         unique_tags = []
#         for item in value:
#             name = item['name'].strip().lower()
#             if name not in seen_names:
#                 seen_names.add(name)
#                 unique_tags.append(item)  # chỉ giữ lại tag đầu tiên
#
#         serializer = TagInputSerializer(data=unique_tags, many=True)
#         serializer.is_valid(raise_exception=True)
#         return serializer.validated_data
#
#     def validate_ingredients(self, value):
#         if not isinstance(value, list):
#             raise serializers.ValidationError("Expected a list of ingredients")
#         seen_names = set()
#         for item in value:
#             name = item['name'].strip().lower()
#             if name in seen_names:
#                 raise serializers.ValidationError({"ingredients": f"Tên nguyên liệu trùng lặp: {item['name']}"})
#             seen_names.add(name)
#         if len(value)<3:
#             raise serializers.ValidationError({"ingredients": "Số nguyên liệu phải lớn hơn hoặc bằng 3"})
#         serializer = IngredientInputSerializer(data=value, many=True)
#         serializer.is_valid(raise_exception=True)
#         return serializer.validated_data
#
#
#     def create(self, validated_data):
#         ingredients_data = validated_data.pop('ingredients')
#         tags_data = validated_data.pop('tags')
#         user = self.context['request'].user
#         image_file = validated_data.pop('image', None)
#         if image_file:
#             # Upload thủ công để chỉ định public_id
#             upload_result = upload(
#                 image_file,
#                 public_id=f"recipes/main_images/{generate_public_id()}"
#             )
#             validated_data['image'] = upload_result['public_id']
#
#         # Tạo công thức
#         recipe = Recipe.objects.create(author=user, **validated_data)
#
#
#         # Tạo nguyên liệu và liên kết
#         for ingredient_data in ingredients_data:
#             name = ingredient_data['name'].strip().lower()
#             quantity = ingredient_data['quantity']
#
#             ingredient, created = Ingredient.objects.get_or_create(name__iexact=name, defaults={'name': name})
#
#             RecipeIngredient.objects.create(
#                 recipe=recipe,
#                 ingredient=ingredient,
#                 quantity=quantity
#             )
#
#         for tag_data in tags_data:
#             name = tag_data['name'].strip().lower()
#             tag, _ = Tag.objects.get_or_create(name__iexact=name, defaults={'name': name})
#             recipe.tags.add(tag)
#
#         return recipe

class RecipeUpdateSerializer(serializers.ModelSerializer):
    tags = serializers.ListField(
        child=serializers.DictField(),  # hoặc slug nếu muốn dùng name
        write_only=True
    )
    ingredients = serializers.ListField(
        child=serializers.DictField(),  # ví dụ {'id': 1, 'quantity': 100, 'unit': 'g'}
        write_only=True
    )

    medias = serializers.ListField(
        child=serializers.DictField(),  # ví dụ {'id': 1, 'quantity': 100, 'unit': 'g'}
        write_only=True
    )

    steps = serializers.ListField(
        child=serializers.DictField(),  # ví dụ {'id': 1, 'quantity': 100, 'unit': 'g'}
        write_only=True
    )

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'description', 'tags', 'ingredients', 'servings', 'cooking_time',
                  'image', 'medias', 'steps']

    def update(self, instance, validated_data):
        # Lấy tags, ingredients ra khỏi validated_data
        tags_data = validated_data.pop('tags', None)
        ingredients_data = validated_data.pop('ingredients', None)
        medias_data = validated_data.pop('medias', None)
        steps_data = validated_data.pop('steps', None)

        # Cập nhật các trường cơ bản
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Cập nhật tags
        if tags_data is not None:
            # Xóa tags cũ
            instance.tags.clear()
            # Tạo các step mới
            # for step in steps_data:
            #     Step.objects.create(
            #         recipe=instance,
            #         order=step.get('order'),
            #         description=step.get('description'),
            #         image=step.get('image')
            #     )
            # Thêm tags mới
            for tag in tags_data:
                tag_id = tag.get('id')
                instance.tags.add(tag_id)

        # Cập nhật ingredients
        if ingredients_data is not None:
            instance.ingredients.clear()
            for ing in ingredients_data:
                # ing = {'name': 'Cà rốt', 'quantity': 100 g}
                ingredient_name = ing.get('name').strip().lower()

                # Tìm ingredient theo name, nếu không có thì tạo mới
                ingredient_obj, created = Ingredient.objects.get_or_create(name=ingredient_name)

                # Thêm vào recipe
                instance.ingredients.add(ingredient_obj)

                # Cập nhật quantity/unit trong bảng trung gian
                RecipeIngredient.objects.update_or_create(
                    recipe=instance,
                    ingredient=ingredient_obj,
                    defaults={'quantity': ing.get('quantity'), 'unit': ing.get('unit')}
                )
                # ing = {'id': 1, 'quantity': 100, 'unit': 'g'}
                # instance.ingredients.add(ing['id'])
                # # Nếu bạn muốn lưu quantity/unit, phải thao tác trên RecipeIngredient
                # RecipeIngredient.objects.update_or_create(
                #     recipe=instance,
                #     ingredient_id=ing['id'],
                #     defaults={'quantity': ing.get('quantity'), 'unit': ing.get('unit')}
                # )

        # Cập nhật steps
        if steps_data is not None:
            # Xóa các step cũ
            instance.steps.all().delete()

            # Tạo các step mới
            # for step in steps_data:
            for index, step in enumerate(steps_data, start=1):
                Step.objects.create(
                    recipe=instance,
                    order=index,
                    description=step.get('description'),
                    image=step.get('image')
                )

        if medias_data is not None:
            # Xóa các step cũ
            instance.medias.all().delete()

            # Tạo các step mới
            for index, media in enumerate(medias_data, start=1):
                RecipeMedia.objects.create(
                    recipe=instance,
                    order=index,
                    media_type=media.get('type'),
                    file=media.get('src'),
                )

        return instance


class RecipeBasicSerializer(serializers.ModelSerializer):
    # ingredients = serializers.SerializerMethodField()
    # tags = serializers.SerializerMethodField()
    image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'title', 'image']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url  # CloudinaryField tự sinh URL
        return None

    # def get_ingredients(self, obj):
    #     return [ing.name for ing in obj.ingredients.all()[:3]]
    #     # return list(obj.ingredients.values_list('name', flat=True)[:3])
    # def get_tags(self, obj):
    #     return [tag.name for tag in obj.tags.all()]

class RecipeOriginalRetrieveSerializer(serializers.ModelSerializer):
    author = AvatarAndNameSerializer()
    ingredients = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    medias = serializers.SerializerMethodField()
    steps = StepListForRecipeOriginalSerializer(many=True)
    # image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'status', 'title', 'description', 'image',
                  'servings', 'cooking_time', 'view_count', 'rating_sum', 'rating_count',
                  'author', 'ingredients', 'tags', 'medias', 'steps']

    def get_author(self, obj):
        return obj.author.get_full_name()  # hoặc obj.author.full_name nếu bạn custom field

    # def get_ingredients(self, obj):
    #     return [ingredient.name for ingredient in obj.ingredients.all()]

    def get_ingredients(self, obj):
        recipe_ingredients = RecipeIngredient.objects.filter(recipe=obj).select_related('ingredient')
        return [
            {
                'id': ri.ingredient.id,
                'name': ri.ingredient.name,
                'quantity': ri.quantity
            }
            for ri in recipe_ingredients
        ]

    def get_medias(self, obj):
        result = []

        for media in obj.medias.all().order_by('order'):
            public_id = media.file.public_id
            media_type = media.media_type  # jpg, mp4, etc.

            result.append({
                'src': public_id,
                'type': media_type
            })

        return result

class RecipeRetrieveSerializer(serializers.ModelSerializer):
    author = AvatarAndNameSerializer()
    ingredients = serializers.SerializerMethodField()
    tags = TagSerializer(many=True)
    medias = serializers.SerializerMethodField()
    steps = StepListSerializer(many=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'status', 'title', 'description', 'image',
                  'servings', 'cooking_time', 'view_count', 'rating_sum', 'rating_count',
                  'author', 'ingredients', 'tags', 'medias', 'steps']

    def get_author(self, obj):
        return obj.author.get_full_name()  # hoặc obj.author.full_name nếu bạn custom field

    # def get_ingredients(self, obj):
    #     return [ingredient.name for ingredient in obj.ingredients.all()]

    def get_ingredients(self, obj):
        recipe_ingredients = RecipeIngredient.objects.filter(recipe=obj).select_related('ingredient')
        return [
            {
                'id': ri.ingredient.id,
                'name': ri.ingredient.name,
                'quantity': ri.quantity
            }
            for ri in recipe_ingredients
        ]

    # def get_tags(self, obj):
    #     return [tag.name for tag in obj.tags.all()]

    def get_medias(self, obj):
        result = []

        for media in obj.medias.all().order_by('order'):
            public_id = media.file.public_id
            media_type = media.media_type  # jpg, mp4, etc.

            # Tạm thời: nếu đuôi là mp4 => video, còn lại là image
            resource_type = "video" if media_type == MediaType.VIDEO else "image"

            url, options = cloudinary_url(
                public_id,
                resource_type=resource_type,  # 'image' hoặc 'video' hoặc 'raw'
            )

            # url = f"https://res.cloudinary.com/{cloud_name}/{resource_type}/upload/{public_id}"
            result.append({
                'src': url,
                'type': media_type
            })

        return result

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None


class RecipeSummarySerializer(serializers.ModelSerializer):
    ingredients = IngredientSerializer(many=True, read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    image = serializers.SerializerMethodField()

    class Meta:
        model = Recipe
        fields = ['id', 'status', 'title', 'image', 'ingredients', 'tags', 'servings', 'cooking_time', 'view_count', 'rating_sum',
                  'rating_count']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None

class RecipeSummaryType2Serializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Recipe
        fields = ['id', 'title', 'image', 'updated_at']

    def get_image(self, obj):
        if obj.image:
            return obj.image.url
        return None
