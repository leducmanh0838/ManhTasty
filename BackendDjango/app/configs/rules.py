import regex

class RecipeRule:
    class Title:
        MIN_TITLE_LENGTH = 5
        MAX_TITLE_LENGTH = 50
        TITLE_VALIDATION_REGEX = regex.compile(r'^[\p{L}\p{N}\s\-_\.,!?\(\)]+$', regex.UNICODE)

    class Description:
        MIN_DESCRIPTION_LENGTH = 10
        MAX_DESCRIPTION_LENGTH = 400

    class Step:
        MIN_STEP_DESCRIPTION_LENGTH = 3
        MAX_STEP_DESCRIPTION_LENGTH = 200
        MIN_STEPS = 2
        MAX_STEPS = 10

    class Media:
        MAX_MEDIAS = 5

    class Tag:
        MAX_TAGS = 10

    class Ingredient:
        MIN_INGREDIENTS = 2
        MAX_INGREDIENTS = 30
        MIN_INGREDIENT_NAME_LENGTH = 2
        MAX_INGREDIENT_NAME_LENGTH = 30
        MIN_INGREDIENT_QUANTITY_LENGTH = 1
        MAX_INGREDIENT_QUANTITY_LENGTH = 20

class RecipeViewRule:
    RECIPE_VIEW_COOLDOWN = 30