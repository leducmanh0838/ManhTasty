# from whoosh.index import open_dir
# from whoosh.qparser import MultifieldParser
# from whoosh.sorting import FieldFacet
# from whoosh.fields import NUMERIC
# import math
#
# INDEX_DIR = "../static/recipe_index"
# PAGE_SIZE = 10
#
# def search_recipes(keyword, page=1):
#     # Mở index
#     ix = open_dir(INDEX_DIR)
#
#     # Tạo parser tìm kiếm trên cả title và ingredients
#     parser = MultifieldParser(["title", "ingredients", "tags"], schema=ix.schema)
#
#     # Phân tích keyword
#     query = parser.parse(keyword)
#
#     # Tìm kiếm với phân trang và sắp xếp id giảm dần
#     with ix.searcher() as searcher:
#         # Sort theo id giảm dần
#         sorted_by_id = FieldFacet("id", reverse=True)
#
#         # Kết quả trang
#         start = (page - 1) * PAGE_SIZE
#         end = start + PAGE_SIZE
#
#         # Thực hiện truy vấn
#         results = searcher.search(query, limit=None, sortedby=sorted_by_id)
#
#         # Tổng số trang
#         total_pages = math.ceil(len(results) / PAGE_SIZE)
#
#         # Lấy kết quả phân trang
#         paginated = results[start:end]
#
#         # Hiển thị kết quả
#         recipes = []
#         for hit in paginated:
#             recipes.append({
#                 "id": hit["id"],
#                 "title": hit["title"],
#                 "ingredients": hit["ingredients"],
#                 "tags": hit["tags"]
#             })
#
#         return {
#             "total": len(results),
#             "total_pages": total_pages,
#             "page": page,
#             "recipes": recipes
#         }
#
#
# result = search_recipes("hành lá", page=1)
# print("total: ", result["total"])
# print("total_pages: ", result["total_pages"])
# print("page: ", result["page"])
# for r in result["recipes"]:
#     print(f"{r['id']} - {r['title']} ({r['ingredients']}) ({r['tags']})")
from pymongo import MongoClient
from datetime import datetime

# Cấu hình kết nối MongoDB (giống như trong settings.py)
MONGODB_SETTINGS = {
    'HOST': 'localhost',
    'PORT': 27017,
    'DB_NAME': 'ManhTasty',
    'COLLECTION': 'search_keywords',
}

# Kết nối
client = MongoClient(host=MONGODB_SETTINGS['HOST'], port=MONGODB_SETTINGS['PORT'])
db = client[MONGODB_SETTINGS['DB_NAME']]
search_collection = db[MONGODB_SETTINGS['COLLECTION']]

# Dữ liệu test
keywords = [
    "bún bò huế",
    "bánh xèo miền trung",
    "lẩu cá kèo",
    "trứng cuộn",
    "chè ba màu"
]

# Ghi vào MongoDB
for keyword in keywords:
    doc = {
        "keyword": keyword,
        "user_id": "main_test_user",
        "searched_at": datetime.now(),
        "ip": "127.0.0.1",
        "user_agent": "Python-Main-Test"
    }
    result = search_collection.insert_one(doc)
    print(f"✅ Ghi '{keyword}' thành công với _id: {result.inserted_id}")

