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
from pprint import pprint


def generate_fake_views():
    import random
    from django.contrib.auth.models import User
    from app.models import Recipe
    from faker import Faker
    from app.utils.mongo_db_utils.view_utils import add_or_update_view

    fake = Faker()

    recipes = Recipe.objects.all()

    for recipe in recipes:
        num_views = random.randint(10, 100)
        views = []
        total_views = 0

        for _ in range(num_views):
            existing_ips = set()
            ip = fake.ipv4()
            while ip in existing_ips:
                ip = fake.ipv4()
            existing_ips.add(ip)

            count = random.randint(1, 1000)  # số view mỗi IP
            total_views += count
            add_or_update_view(recipe_id=str(recipe.id), ip_address=ip, count=count)
            # views.append(RecipeView(
            #     recipe=recipe,
            #     ip_address=ip,
            #     count=count
            # ))

        # Bulk create views
        # RecipeView.objects.bulk_create(views)

        # Cập nhật view_count trong Recipe
        print("total_views: ", total_views)
        recipe.view_count = total_views
        recipe.save()
        print("recipe id: ", recipe.id)


def generate_fake_reviews():
    fake = Faker()

    recipes = Recipe.objects.all()
    users = list(User.objects.all())  # danh sách user để gán review

    for recipe in recipes:
        num_reviews = random.randint(1, 50)  # mỗi recipe có 5-50 review
        reviews = []
        total_rating = 0

        sampled_users = random.sample(users, min(num_reviews, len(users)))

        for user in sampled_users:
            if RecipeReview.objects.filter(recipe=recipe, user=user).exists():
                continue
            rating = random.randint(2, 5)
            comment = fake.sentence(nb_words=12)

            reviews.append(RecipeReview(
                recipe=recipe,
                user=user,
                rating=rating,
                comment=comment
            ))

            total_rating += rating

        # Bulk create review để nhanh
        RecipeReview.objects.bulk_create(reviews)

        # Cập nhật rating_sum, rating_count
        recipe.rating_sum += total_rating
        recipe.rating_count += len(reviews)
        recipe.save()
        print("recipe id: ", recipe.id)

    print("Done creating random reviews!")


def generate_fake_reactions():
    recipes = Recipe.objects.all()
    users = list(User.objects.all())
    recipe_content_type = ContentType.objects.get_for_model(Recipe)

    # Tỉ lệ emotion: 1 nhiều hơn các số khác
    emotions = [1] * 50 + [2] * 20 + [3] * 8 + [4] * 8 + [5] * 20 + [6] * 1  # tổng 100 phần, 1 chiếm 50%

    for recipe in recipes:
        num_reactions = random.randint(5, min(100, len(users)))  # số lượng reaction cho mỗi recipe
        sampled_users = random.sample(users, num_reactions)

        reactions = []

        for user in sampled_users:
            emotion = random.choice(emotions)

            # Kiểm tra unique_together để không duplicate
            if Reaction.objects.filter(user=user, content_type=recipe_content_type, object_id=recipe.id).exists():
                continue

            reactions.append(Reaction(
                user=user,
                emotion=emotion,
                content_type=recipe_content_type,
                object_id=recipe.id
            ))

        # Bulk create để nhanh
        Reaction.objects.bulk_create(reactions)
        print("recipe id: ", recipe.id)

    print("Done creating random reactions!")


def generate_fake_comments():
    fake = Faker()

    recipes = Recipe.objects.all()
    users = list(User.objects.all())

    for recipe in recipes:
        comments = []

        # Tạo bình luận cha (bậc 1)
        num_parent_comments = random.randint(5, 50) # mỗi bình luận cha có 0-50 phản hồi
        sampled_users_parent = random.sample(users, min(num_parent_comments, len(users)))

        parent_comments = []

        for user in sampled_users_parent:
            content = fake.sentence(nb_words=12)
            comment = Comment(
                recipe=recipe,
                user=user,
                content=content,
                parent=None  # bình luận cha
            )
            parent_comments.append(comment)

        Comment.objects.bulk_create(parent_comments)

        # Reload để có id cho parent
        parent_comments = Comment.objects.filter(recipe=recipe, parent=None)
        # Tạo phản hồi (bậc 2)
        for parent in parent_comments:
            num_replies = random.randint(-50, 50)  # mỗi bình luận cha có 0-50 phản hồi
            if num_replies<=0:
                continue
            sampled_users_reply = random.sample(users, min(num_replies, len(users)))

            replies = []
            for user in sampled_users_reply:
                content = fake.sentence(nb_words=10)
                replies.append(Comment(
                    recipe=recipe,
                    user=user,
                    content=content,
                    parent=parent
                ))

            Comment.objects.bulk_create(replies)

        print("recipe id: ", recipe.id)

    print("Done creating comments with replies!")

if __name__ == "__main__":
    import django
    import os
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
    django.setup()

    import random

    from django.contrib.contenttypes.models import ContentType
    from faker import Faker

    from app.models import Reaction, Recipe, User, RecipeReview, Comment
    from django.core.cache import cache
    from functools import reduce
    from django.db.models import Q
    from django.db.models import Count

    # tags = [3, 54]
    #
    # recipes = (
    #     Recipe.objects
    #     .filter(tags__id__in=tags)
    #     .annotate(num_match=Count("tags", filter=Q(tags__id__in=tags), distinct=True))
    #     .filter(num_match=len(tags))
    # )
    #
    # print(f"Tìm với tags={tags}, số recipe: {recipes.count()}")
    # for r in recipes:
    #     print({
    #         "id": r.id,
    #         "title": r.title,
    #         "tags": list(r.tags.values("id", "name"))
    #     })

    # generate_fake_views()
    # generate_fake_reviews()
    # generate_fake_comments()
    # generate_fake_reactions()
    # Comment.objects.filter(id__gt=10000).delete()
    Recipe.objects.filter(id=17).delete()
    print("thành công")
# YOUR_API_KEY = "c4062d20-b045-4b39-834b-344b9127a29e"
# from ai21 import AI21Client
# from ai21.models.chat import ChatMessage
#
# client = AI21Client(
#     # defaults to os.environ.get('AI21_API_KEY')
#     api_key=YOUR_API_KEY,
# )
#
# system = "You're a support engineer in a SaaS company"
# messages = [
#     ChatMessage(content=system, role="system"),
#     ChatMessage(content="Hello, I need help with a signup process.", role="user"),
# ]
#
# chat_completions = client.chat.completions.create(
#     messages=messages,
#     model="jamba-mini",
# )
#
# # pprint(vars(chat_completions))
# for choice in chat_completions.choices:
#     print(choice.message.content)