import math

from whoosh.index import open_dir
from whoosh.fields import Schema, TEXT, ID
import os
from django.conf import settings
from whoosh.qparser import MultifieldParser
from whoosh.sorting import FieldFacet

INDEX_DIR = os.path.join(settings.BASE_DIR, "app/static/recipe_index")

def update_index_for_recipe(recipe):
    if not os.path.exists(INDEX_DIR):
        return  # Nếu index chưa tồn tại, bỏ qua

    try:
        ix = open_dir(INDEX_DIR)
        writer = ix.writer()

        ingredient_text = ", ".join([ing.name for ing in recipe.ingredients.all()])

        writer.update_document(
            id=str(recipe.id),
            title=recipe.title,
            ingredients=ingredient_text
        )

        writer.commit()
        ix.optimize()
        print(f"✅ Cập nhật index cho món ăn ID {recipe.id}")
    except Exception as e:
        print(f"❌ Lỗi cập nhật index: {e}")


PAGE_SIZE = 10

def search_recipes(keyword, page=1):
    # Mở index
    ix = open_dir(INDEX_DIR)

    # Tạo parser tìm kiếm trên cả title và ingredients
    parser = MultifieldParser(["title", "ingredients", "tags"], schema=ix.schema)

    # Phân tích keyword
    query = parser.parse(keyword)

    # Tìm kiếm với phân trang và sắp xếp id giảm dần
    with ix.searcher() as searcher:
        # Sort theo id giảm dần
        sorted_by_id = FieldFacet("id", reverse=True)

        # Kết quả trang
        start = (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE

        # Thực hiện truy vấn
        results = searcher.search(query, limit=None, sortedby=sorted_by_id)

        # Tổng số trang
        total_pages = math.ceil(len(results) / PAGE_SIZE)

        # Lấy kết quả phân trang
        paginated = results[start:end]

        # Hiển thị kết quả
        recipes = []
        for hit in paginated:
            recipes.append({
                "id": hit["id"],
                "title": hit["title"],
                "ingredients": hit["ingredients"],
                "tags": hit["tags"]
            })

        return {
            "total": len(results),
            "total_pages": total_pages,
            "page": page,
            "recipes": recipes
        }
