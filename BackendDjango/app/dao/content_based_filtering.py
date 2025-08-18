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