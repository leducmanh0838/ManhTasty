# app/tasks.py
def my_task():
    print("Task đang chạy 2")

# recipes/tasks.py
from datetime import timedelta
from django.utils import timezone
from .models import Recipe, RecipeStatus

def clean_deleted_recipes():
    print("Task xóa thùng rác")
    threshold_date = timezone.now() - timedelta(days=30)
    recipes = Recipe.objects.filter(
        status=RecipeStatus.DELETED,
        updated_at__lt=threshold_date
    )
    count = recipes.count()

    if count > 0:
        print(f"Sẽ xóa {count} công thức quá 30 ngày:")
        for r in recipes:
            print(f"- {r.title} (ID={r.id})")

    recipes.delete()
    return f"Deleted {count} recipes older than 30 days"