# serializers.py
from bson import ObjectId
from rest_framework import serializers

from app.models import Recipe, Ingredient, Step, Tag, RecipeStatus, RecipeTag, RecipeIngredient, RecipeMedia
from app.utils.mongodb import recipe_drafts_collection


class CreateRecipeFromDraftSerializer(serializers.Serializer):
    # draft_id = serializers.CharField()

    def create(self, validated_data):
        draft_id = self.context.get("draft_id")
        print("draft_id: ", draft_id)

        # 1. Lấy bản nháp từ MongoDB
        user = self.context['request'].user
        draft = recipe_drafts_collection.find_one(
            {
                "_id": ObjectId(draft_id),
                # "user_id": user.id
            }
        )
            # draft = RecipeDraft.objects.get(pk=draft_id)
        if not draft:
            raise serializers.ValidationError("Bản nháp không tồn tại")

        # 2. Tạo Recipe mới
        recipe = Recipe.objects.create(
            title=draft["title"],
            description=draft["description"],
            image=draft["image"],
            author_id=draft["user_id"],
            status=RecipeStatus.ACTIVE
        )

        # 3. Lưu Tags
        tag_ids = [tag["id"] for tag in draft["tags"]]
        print("tag_ids: ", tag_ids)
        tags = Tag.objects.filter(id__in=tag_ids)
        RecipeTag.objects.bulk_create([
            RecipeTag(recipe=recipe, tag=tag) for tag in tags
        ])

        # 4. Lưu Ingredients
        for ing in draft["ingredients"]:
            name = ing.get("name", "").strip()
            quantity = ing.get("quantity", "")
            if not name:
                continue  # nếu không có tên thì bỏ qua

            # Tìm hoặc tạo Ingredient theo name
            ingredient, created = Ingredient.objects.get_or_create(name=name)

            # Tạo RecipeIngredient
            RecipeIngredient.objects.create(
                recipe=recipe,
                ingredient=ingredient,
                quantity=quantity
            )

        # 5. Lưu Steps
        Step.objects.bulk_create([
            Step(
                recipe=recipe,
                order=index+1,
                description=step["description"],
                image=step.get("image")
            )
            for index, step in enumerate(draft["steps"])
        ])

        # 6. Lưu RecipeMedia
        RecipeMedia.objects.bulk_create([
            RecipeMedia(
                recipe=recipe,
                media_type=media["type"],
                file=media["src"],
                order=index
            )
            # for media in draft.medias
            for index, media in enumerate(draft["medias"])
        ])
        #
        # # 7. Xóa bản nháp
        # draft.delete()

        return recipe
