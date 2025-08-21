import math
import shutil

from whoosh.fields import Schema, ID, TEXT
from whoosh.index import open_dir, create_in, exists_in
import os
from django.conf import settings
from whoosh.qparser import MultifieldParser
from whoosh.sorting import FieldFacet

from app.configs.whoosh_config import INDEX_DIR
from app.models import Recipe, RecipeStatus

# INDEX_DIR = os.path.join(settings.BASE_DIR, "app/static/recipe_index")

schema = Schema(
    id=ID(stored=True, unique=True),
    title=TEXT(stored=True),
    ingredients=TEXT(stored=True),
    tags=TEXT(stored=True),
)

def rebuild_index():
    print("rebuild_index")
    # Xóa thư mục cũ (đảm bảo sạch)
    if os.path.exists(INDEX_DIR):
        shutil.rmtree(INDEX_DIR)
    os.makedirs(INDEX_DIR)

    ix = create_in(INDEX_DIR, schema)
    writer = ix.writer()

    # Thêm toàn bộ dữ liệu vào index
    for recipe in Recipe.objects.filter(status=RecipeStatus.ACTIVE):
        ingredient_names = [ing.name for ing in recipe.ingredients.all()]
        ingredient_text = ", ".join(ingredient_names)

        tag_names = [tag.name for tag in recipe.tags.all()]
        tag_text = ", ".join(tag_names)

        writer.add_document(
            id=str(recipe.id),
            title=recipe.title,
            ingredients=ingredient_text,
            tags=tag_text,
        )

    writer.commit()
    ix.optimize()
    print("✅ Rebuilt index thành công.")

def build_index():
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
        rebuild_index()


RECIPE_SEARCH_PAGE_SIZE = 10

def search_recipes(keyword):
    # Mở index
    ix = open_dir(INDEX_DIR)

    # Tạo parser tìm kiếm trên cả title và ingredients
    parser = MultifieldParser(["title", "ingredients", "tags"], schema=ix.schema)

    # Phân tích keyword
    query = parser.parse(keyword)

    # Tìm kiếm với phân trang và sắp xếp id giảm dần
    with ix.searcher() as searcher:
        # Sort theo id giảm dần
        # sorted_by_id = FieldFacet("id", reverse=True)

        # Kết quả trang
        # start = (page - 1) * RECIPE_SEARCH_PAGE_SIZE
        # end = start + RECIPE_SEARCH_PAGE_SIZE

        # Thực hiện truy vấn
        # results = searcher.search(query, limit=None, sortedby=sorted_by_id)
        results = searcher.search(query, limit=None)

        # Tổng số trang
        # total_pages = math.ceil(len(results) / RECIPE_SEARCH_PAGE_SIZE)

        # Lấy kết quả phân trang
        # paginated = results[start:end]

        # Hiển thị kết quả
        recipes = []
        for hit in results:
            recipes.append({
                "id": hit["id"],
                "title": hit["title"],
                "ingredients": hit["ingredients"],
                "tags": hit["tags"]
            })

        print("recipes: ", recipes)
        return recipes
        # return {
        #     "total": len(results),
        #     "total_pages": total_pages,
        #     "page": page,
        #     "recipes": recipes
        # }
