# import os
# import django
#
# # Cấu hình Django
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
# django.setup()
#
# from app.models import Recipe  # Import model sau khi setup
# from whoosh.index import create_in, open_dir
# from whoosh.fields import Schema, TEXT, ID
#
# schema = Schema(
#     id=ID(stored=True, unique=True),
#     title=TEXT(stored=True),
#     description=TEXT(stored=True),
#     ingredients=TEXT(stored=True),
# )
#
# if not os.path.exists("static/search_index"):
#     os.mkdir("static/search_index")
#     ix = create_in("static/search_index", schema)
# else:
#     ix = open_dir("static/search_index")
#
# writer = ix.writer()
#
# for recipe in Recipe.objects.all():
#     ingredients = ", ".join([i.name for i in recipe.ingredients.all()])
#     writer.add_document(
#         id=str(recipe.id),
#         title=recipe.title,
#         description=recipe.description or "",
#         ingredients=ingredients,
#     )
#
# writer.commit()
