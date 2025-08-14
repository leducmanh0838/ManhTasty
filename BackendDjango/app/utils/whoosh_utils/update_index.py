import os

from django.conf import settings
from whoosh.index import exists_in, open_dir

from app.configs.whoosh_config import INDEX_DIR


# from app.utils.whoosh_utils.common_whoosh_utils import INDEX_DIR

def update_index_for_recipe(recipe):
    if not exists_in(INDEX_DIR):
        return

    try:
        ix = open_dir(INDEX_DIR)
        writer = ix.writer()

        ingredient_text = ", ".join([ing.name for ing in recipe.ingredients.all()])
        tags_text = ", ".join([tag.name for tag in recipe.tags.all()])

        writer.update_document(
            id=str(recipe.id),
            title=recipe.title,
            ingredients=ingredient_text,
            tags=tags_text
        )

        writer.commit()
        ix.optimize()
        print(f"Cập nhật index cho món ăn ID {recipe.id}")
    except Exception as e:
        print(f"Lỗi cập nhật index: {e}")