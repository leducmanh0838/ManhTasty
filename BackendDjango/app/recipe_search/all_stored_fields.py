# from whoosh.index import create_in, open_dir
# from whoosh.fields import Schema, TEXT, ID
# from whoosh.qparser import QueryParser, MultifieldParser
# import os
# from django.conf import settings
# import django
#
# # Khởi tạo Django nếu chạy file riêng
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")  # Đổi tên project cho đúng
# django.setup()
#
# from app.models import Recipe  # Đổi your_app cho đúng
#
# # 1. Khai báo schema
# schema = Schema(
#     id=ID(stored=True, unique=True),       # để truy xuất recipe từ DB
#     title=TEXT(stored=True),               # tìm kiếm theo tiêu đề
#     ingredients=TEXT(stored=True)          # tìm kiếm theo nguyên liệu
# )
#
# # 2. Tạo hoặc mở thư mục chỉ mục
# INDEX_DIR = "../static/recipe_index"
# if not os.path.exists(INDEX_DIR):
#     os.makedirs(INDEX_DIR)
#     ix = create_in(INDEX_DIR, schema)
# else:
#     ix = open_dir(INDEX_DIR)
#
# # 3. Ghi dữ liệu vào chỉ mục
# writer = ix.writer()
#
# from app.models import Recipe  # thay bằng app của bạn
#
# for recipe in Recipe.objects.all():
#     ingredient_names = [ing.name for ing in recipe.ingredients.all()]
#     ingredient_text = ", ".join(ingredient_names)
#
#     writer.add_document(
#         id=str(recipe.id),
#         title=recipe.title,
#         ingredients=ingredient_text
#     )
#
# writer.commit()
# print("✅ Đã ghi xong tất cả recipe vào chỉ mục Whoosh.")
#
#
# def search_recipes(query_text):
#     ix = open_dir(INDEX_DIR)
#     with ix.searcher() as searcher:
#         # Tìm trên cả title và ingredients
#         parser = MultifieldParser(["title", "ingredients"], schema=ix.schema)
#         query = parser.parse(query_text)
#
#         results = searcher.search(query, limit=10)  # Giới hạn kết quả
#
#         recipe_ids = [hit["id"] for hit in results]
#         return recipe_ids


from whoosh.index import open_dir
from whoosh.qparser import QueryParser

INDEX_DIR = "../static/recipe_index"

# Mở thư mục chứa chỉ mục
ix = open_dir(INDEX_DIR)

# Mở searcher để duyệt các document
with ix.searcher() as searcher:
    for doc in searcher.all_stored_fields():
        print(doc)
