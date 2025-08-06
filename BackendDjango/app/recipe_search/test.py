from whoosh.index import open_dir
from whoosh.qparser import MultifieldParser
from whoosh.sorting import FieldFacet
from whoosh.fields import NUMERIC
import math

INDEX_DIR = "../static/recipe_index"
PAGE_SIZE = 10


def search_recipes(keyword, page=1):
    # Mở index
    ix = open_dir(INDEX_DIR)

    # Tạo parser tìm kiếm trên cả title và ingredients
    parser = MultifieldParser(["title", "ingredients"], schema=ix.schema)

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
                "ingredients": hit["ingredients"]
            })

        return {
            "total": len(results),
            "total_pages": total_pages,
            "page": page,
            "recipes": recipes
        }

result = search_recipes("trứng", page=1)
print("total: ", result["total"])
print("total_pages: ", result["total_pages"])
print("page: ", result["page"])
for r in result["recipes"]:
    print(f"{r['id']} - {r['title']} ({r['ingredients']})")
