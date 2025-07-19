import datetime
from uuid import uuid4

import cloudinary
from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.db import models

# Create your models here.
class LoginType(models.IntegerChoices):
    SYSTEM = 1, 'System'
    GOOGLE = 2, 'Google'
    FACEBOOK = 3, 'Facebook'

# 1. User
class User(AbstractUser):
    login_type = models.PositiveSmallIntegerField(choices=LoginType.choices, default=LoginType.SYSTEM)
    # avatar_url = models.URLField(blank=True, null=True)
    avatar = CloudinaryField('avatar', null=True, blank=True)

    def __str__(self):
        return self.username


# 2. Công thức
class Recipe(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes')
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = CloudinaryField('image', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField('Tag', blank=True)
    ingredients = models.ManyToManyField('Ingredient', through='RecipeIngredient', related_name='recipes')

    def __str__(self):
        return self.title

    def upload_image(self, file):
        today = datetime.date.today()
        folder = f"recipes/{today.year}/{today.month:02}"
        result = cloudinary.uploader.upload(
            file,
            public_id=f"{folder}/{self.id or uuid4()}",
            overwrite=True
        )
        self.image = result["public_id"]
        self.image_url = result["secure_url"]
        self.save()

# 3. Nguyên liệu
class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.quantity} of {self.ingredient.name} for {self.recipe.title}"

    class Meta:
        db_table = 'app_recipe_ingredient'
# class Ingredient(models.Model):
#     recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='ingredients')
#     name = models.CharField(max_length=100)
#     quantity = models.CharField(max_length=100)
#
#     def __str__(self):
#         return f"{self.quantity} {self.name}"

# 4. Các bước nấu ăn
class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    order = models.PositiveIntegerField()
    description = models.TextField()
    image = models.ImageField(upload_to='steps/', null=True, blank=True)

    class Meta:
        ordering = ['order']

# 5. Bình luận
class Comment(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies'
    )

    def is_reply(self):
        return self.parent is not None

    def __str__(self):
        return f"{self.user} - {'Reply' if self.is_reply() else 'Comment'}"

# 6. Lượt thích
class Like(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('recipe', 'user')  # mỗi user chỉ like 1 lần

# 7. Tag
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    def __str__(self):
        return self.name

# 8. Báo cáo vi phạm
class Report(models.Model):
    REPORT_REASONS = [
        ('spam', 'Spam hoặc nội dung rác'),
        ('abuse', 'Lăng mạ / kích động'),
        ('inaccurate', 'Thông tin sai'),
        ('other', 'Khác'),
    ]

    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    reason = models.CharField(max_length=20, choices=REPORT_REASONS)
    description = models.TextField(blank=True)  # lý do chi tiết nếu cần

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    target = GenericForeignKey('content_type', 'object_id')  # liên kết tới Recipe hoặc Comment

    created_at = models.DateTimeField(auto_now_add=True)
    is_resolved = models.BooleanField(default=False)  # xử lý chưa

    def __str__(self):
        return f"{self.reporter} báo cáo {self.content_type} #{self.object_id}"