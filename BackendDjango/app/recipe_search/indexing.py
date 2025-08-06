import os

from django.conf import settings
from whoosh.index import create_in, open_dir, exists_in
from whoosh.fields import Schema, TEXT, ID
import shutil

from app.models import RecipeStatus, Recipe

INDEX_DIR = os.path.join(settings.BASE_DIR, 'app', 'static', 'recipe_index')

schema = Schema(
    id=ID(stored=True, unique=True),
    title=TEXT(stored=True),
    ingredients=TEXT(stored=True)
)

def build_index():
    from app.models import Recipe
    # from django.db import connection

    print("build_index")

    # if connection.connection is None:
    #     print("connection.connection is None")
    #     return  # Đảm bảo DB đã kết nối

    # print("not os.path.exists(INDEX_DIR): ", not os.path.exists(INDEX_DIR))

    if not os.path.exists(INDEX_DIR):
        print("not os.path.exists(INDEX_DIR)")
        os.makedirs(INDEX_DIR)

    if not exists_in(INDEX_DIR):
        print("not exists_in(INDEX_DIR)")
        ix = create_in(INDEX_DIR, schema)
        writer = ix.writer()

        for recipe in Recipe.objects.filter(status=RecipeStatus.ACTIVE):
            ingredient_names = [ing.name for ing in recipe.ingredients.all()]
            ingredient_text = ", ".join(ingredient_names)

            writer.add_document(
                id=str(recipe.id),
                title=recipe.title,
                ingredients=ingredient_text
            )
        writer.commit()


def rebuild_index():
    INDEX_DIR = os.path.join(settings.BASE_DIR, 'app/static/recipe_index')

    # Xóa thư mục cũ (đảm bảo sạch)
    if os.path.exists(INDEX_DIR):
        shutil.rmtree(INDEX_DIR)
    os.makedirs(INDEX_DIR)

    # Tạo schema và index mới
    schema = Schema(
        id=ID(stored=True, unique=True),
        title=TEXT(stored=True),
        ingredients=TEXT(stored=True)
    )
    ix = create_in(INDEX_DIR, schema)
    writer = ix.writer()

    # Thêm toàn bộ dữ liệu vào index
    for recipe in Recipe.objects.filter(status=RecipeStatus.ACTIVE):
        ingredient_names = [ing.name for ing in recipe.ingredients.all()]
        ingredient_text = ", ".join(ingredient_names)

        writer.add_document(
            id=str(recipe.id),
            title=recipe.title,
            ingredients=ingredient_text
        )

    writer.commit()
    ix.optimize()
    print("✅ Rebuilt index thành công.")