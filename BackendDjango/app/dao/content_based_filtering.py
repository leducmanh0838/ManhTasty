from django.db.models import Count, Q, F

from app.models import Recipe

WEIGHT_INGREDIENT = 2
WEIGHT_TAG = 1

def get_recipe_recommend(recipe_id, limit):
    current_recipe = Recipe.objects.get(id=recipe_id)
    current_ingredients = current_recipe.ingredients.all()
    current_tags = current_recipe.tags.all()

    recipes_with_ingredient_score = Recipe.objects.exclude(id=current_recipe.id).annotate(
        ingredient_score=Count('ingredients', filter=Q(ingredients__in=current_ingredients), distinct=True)
    )

    recipes_with_tag_score = recipes_with_ingredient_score.annotate(
        tag_score=Count('tags', filter=Q(tags__in=current_tags), distinct=True)
    )

    recipes_with_total_score = recipes_with_tag_score.annotate(
        total_score=F('ingredient_score')*WEIGHT_INGREDIENT + F('tag_score')*WEIGHT_TAG
    ).order_by('-total_score')[:limit]

    return recipes_with_total_score

from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from app.models import Recipe, Ingredient

def get_similar_recipes(recipe_id, top_n=5):
    # Lấy tất cả công thức
    recipes = Recipe.objects.all().prefetch_related("ingredients")

    # Lấy danh sách tất cả ingredient id (dùng để làm vector)
    all_ingredient_ids = list(Ingredient.objects.values_list("id", flat=True))

    # Map ingredient_id -> index
    ingredient_index = {ing_id: idx for idx, ing_id in enumerate(all_ingredient_ids)}

    # Tạo ma trận vector nhị phân cho từng recipe
    vectors = []
    recipe_list = []
    for recipe in recipes:
        vec = np.zeros(len(all_ingredient_ids))
        for ing in recipe.ingredients.all():
            vec[ingredient_index[ing.id]] = 1
        vectors.append(vec)
        recipe_list.append(recipe)

    vectors = np.array(vectors)

    # Lấy index của recipe cần tìm
    try:
        current_index = recipe_list.index(Recipe.objects.get(id=recipe_id))
    except ValueError:
        return []

    # Tính cosine similarity
    similarities = cosine_similarity([vectors[current_index]], vectors)[0]

    # Sắp xếp theo độ tương tự, bỏ chính nó
    similar_indices = np.argsort(similarities)[::-1]  # giảm dần
    similar_indices = [i for i in similar_indices if i != current_index]

    # Lấy top N
    top_indices = similar_indices[:top_n]

    return [recipe_list[i] for i in top_indices]