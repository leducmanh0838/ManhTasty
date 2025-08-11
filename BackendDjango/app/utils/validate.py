from rest_framework import serializers

from app.configs.rules import RecipeRule


def validate_recipe_data(data):

    # Title
    if (not data.get("title") or
            len(data["title"].strip()) < RecipeRule.Title.MIN_TITLE_LENGTH or
            len(data["title"].strip()) > RecipeRule.Title.MAX_TITLE_LENGTH):
        raise serializers.ValidationError(f"Tiêu đề món ăn phải số ký tự từ {RecipeRule.Title.MIN_TITLE_LENGTH} đến {RecipeRule.Title.MAX_TITLE_LENGTH}.")

    if not RecipeRule.Title.TITLE_VALIDATION_REGEX.match(data["title"]):
        raise serializers.ValidationError(
            f"Tiêu đề chỉ cho phép chữ, số, khoảng trắng và các ký tự: - _ . , ! ? ( ).")

    # Description
    # if not data.get("description") or len(data["description"].strip()) < 10:
    #     errors.append("Mô tả món ăn phải có ít nhất 10 ký tự.")
    if (not data.get("description") or
            len(data["description"].strip()) < RecipeRule.Description.MIN_DESCRIPTION_LENGTH or
            len(data["description"].strip()) > RecipeRule.Description.MAX_DESCRIPTION_LENGTH):
        raise serializers.ValidationError(f"Mô tả món ăn phải đúng số lượng ký tự.")


    # Image (bắt buộc)
    print("data.get(image): ", data.get("image"))
    if data.get("image") is None:
        raise serializers.ValidationError("Vui lòng tải ảnh món ăn.")

    # Steps
    if not data.get("steps") or len(data["steps"]) < RecipeRule.Step.MIN_STEPS or len(data["steps"]) > RecipeRule.Step.MAX_STEPS:
        raise serializers.ValidationError("Số bước nấu ăn phải hợp lệ ")
    else:
        for i, step in enumerate(data["steps"], start=1):
            if not step.get("description") or len(step["description"].strip()) < RecipeRule.Step.MIN_STEP_DESCRIPTION_LENGTH:
                raise serializers.ValidationError.append(f"Bước {i} cần mô tả đủ ký tự.")

    # Tags
    # if not data. len(data["tags"]) == 0:
    #     errors.append("Phải có ít nhất 1 tag cho món ăn.")

    # Ingredients
    # if not data.get("ingredients") or len(data["ingredients"]) == 0:
    #     errors.append("Phải có ít nhất 1 nguyên liệu.")
    # else:
    #     for i, ing in enumerate(data["ingredients"], start=1):
    #         if not ing.get("name") or not ing.get("quantity"):
    #             errors.append(f"Nguyên liệu {i} thiếu tên hoặc số lượng.")
