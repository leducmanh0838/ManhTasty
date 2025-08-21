from cloudinary.models import CloudinaryField
from django.contrib.auth.models import AbstractUser
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models

from app.utils.whoosh_utils.update_index import update_index_for_recipe


# Create your models here.
class LoginType(models.IntegerChoices):
    SYSTEM = 1, 'System'
    GOOGLE = 2, 'Google'
    FACEBOOK = 3, 'Facebook'


class ReasonType(models.IntegerChoices):
    SPAM = 1, 'Spam'
    UNSUITABLE = 2, 'Không phù hợp'
    INACCURATE = 3, 'Sai sự thật'
    OTHER = 4, 'Khác'


class EmotionType(models.IntegerChoices):
    LIKE = 1, 'Like'
    LOVE = 2, 'Love'
    HAHA = 3, 'Haha'
    WOW = 4, 'Wow'
    DELICIOUS = 5, 'Delicious'
    ANGRY = 6, 'Angry'


class RecipeStatus(models.IntegerChoices):
    CREATING = -1, 'Đang tạo'
    DRAFT = 0, 'Nháp'  # Người dùng chưa đăng
    PENDING = 1, 'Đang chờ'  # Admin sẽ kiểm duyệt (nếu có)
    ACTIVE = 2, 'Đang hoạt động'  # Công khai, mọi người thấy
    INACTIVE = 3, 'Không hoạt động'  # Không xóa, nhưng ẩn khỏi người dùng
    DELETED = 4, 'Bị xóa'  # Đã đưa vào thùng rác
    LOCKED = 5, 'Bị khóa'


class CommentStatus(models.IntegerChoices):
    ACTIVE = 1, 'Đang hoạt động'
    INACTIVE = 2, 'Không hoạt động'
    DELETED = 3, 'Bị xóa'
    LOCKED = 4, 'Bị khóa'


class ReportStatus(models.IntegerChoices):  # Người dùng chưa đăng
    PENDING = 1, "Chờ xử lý"
    REVIEWED = 2, "Đã xem xét"
    ACCEPTED = 3, "Hợp lệ"
    REJECTED = 4, "Không hợp lệ"
    RESOLVED = 5, "Đã giải quyết"


class TagCategory(models.IntegerChoices):
    OTHER = 0, 'Khác'
    TYPE = 1, 'Loại món'
    OCCASION = 2, 'Dịp'
    INGREDIENT = 3, 'Nguyên liệu chính'
    DIET = 4, 'Chế độ ăn'
    METHOD = 5, 'Cách chế biến'
    REGION = 6, 'Vùng miền'
    FLAVOR = 7, 'Hương vị'


class MediaType(models.IntegerChoices):
    IMAGE = 1, 'Image'
    GIF = 2, 'GIF'
    VIDEO = 3, 'Video'


class NotificationType(models.IntegerChoices):
    REPORT_RECIPE = 1, 'Báo cáo món ăn'
    REPORT_COMMENT = 2, 'Báo cáo bình luận'
    SYSTEM = 3, 'Thông báo hệ thống'


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# 1. User
class User(AbstractUser):
    login_type = models.SmallIntegerField(choices=LoginType.choices, default=LoginType.SYSTEM,
                                          verbose_name="Kiểu đăng nhập")
    # avatar_url = models.URLField(blank=True, null=True)
    avatar = models.URLField(null=True, blank=True)

    def __str__(self):
        return self.username


# 2. Công thức
class Recipe(TimeStampedModel):
    status = models.SmallIntegerField(choices=RecipeStatus.choices, default=RecipeStatus.CREATING, db_index=True,
                                      verbose_name="Trạng thái")
    title = models.CharField(max_length=255, verbose_name="Tiêu đề")
    description = models.TextField(verbose_name="Mô tả")
    image = CloudinaryField('Ảnh', null=True, blank=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipes', verbose_name="Tác giả")
    servings = models.PositiveIntegerField(null=True, verbose_name="Số người ăn")
    cooking_time = models.PositiveIntegerField(null=True, verbose_name="Thời gian nấu (phút)")
    view_count = models.PositiveIntegerField(default=0, verbose_name="Lượt xem")
    rating_sum = models.PositiveIntegerField(default=0, verbose_name="Tổng sao")  # Tổng số sao
    rating_count = models.PositiveIntegerField(default=0, verbose_name="Số lượt đánh giá")  # Số lượt đánh giá

    tags = models.ManyToManyField('Tag', through='RecipeTag', related_name='tags')
    ingredients = models.ManyToManyField('Ingredient', through='RecipeIngredient', related_name='recipes',
                                         verbose_name="Nguyên liệu")
    reactions = GenericRelation('Reaction', verbose_name="Phản ứng")
    reports = GenericRelation('Report', verbose_name="Báo cáo")

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)  # lưu model
        # Thực hiện các thao tác khác sau khi lưu, ví dụ cập nhật index
        update_index_for_recipe(self)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Công thức"  # tên số ít
        verbose_name_plural = "Các công thức"  # tên số nhiều


# 3 Media của công thức
class RecipeMedia(TimeStampedModel):
    recipe = models.ForeignKey('Recipe', on_delete=models.CASCADE, related_name='medias')
    media_type = models.SmallIntegerField(choices=MediaType.choices)
    file = CloudinaryField('media')  # hoặc dùng URLField nếu tự upload
    order = models.PositiveIntegerField(default=0)  # để sắp xếp ảnh/gif/video

    # caption = models.CharField(max_length=255, blank=True)  # mô tả ảnh nếu cần

    def __str__(self):
        return f'{self.recipe.title} - {self.media_type}'

    class Meta:
        verbose_name = "Media"  # tên số ít
        verbose_name_plural = "Các media"  # tên số nhiều


# 4. Tag
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True, verbose_name="tên")
    tag_category = models.SmallIntegerField(choices=TagCategory.choices, default=TagCategory.OTHER,
                                            verbose_name="Thể loại tag")
    image = models.ImageField(
        upload_to='tags/',  # Ảnh sẽ lưu trong MEDIA_ROOT/tags/
        null=True,
        blank=True,
        verbose_name="Ảnh"
    )
    is_featured = models.BooleanField("Nổi bật", default=False)

    def save(self, *args, **kwargs):
        self.name = self.name.lower()  # chuyển về lowercase
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Tag"  # tên số ít
        verbose_name_plural = "Các tag"  # tên số nhiều


# 5. Bảng trung gian của công thức và tag
class RecipeTag(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    tag = models.ForeignKey('Tag', on_delete=models.CASCADE)


# 6. Nguyên liệu
class Ingredient(models.Model):
    name = models.CharField(max_length=100, verbose_name="Tên")

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Nguyên liệu"  # tên số ít
        verbose_name_plural = "Các nguyên liệu"  # tên số nhiều


# 7.Trung gian của nguyên liệu và công thức
class RecipeIngredient(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE, verbose_name="Nguyên liệu")
    quantity = models.CharField(max_length=100, verbose_name="Số lượng")

    def __str__(self):
        return f"{self.quantity} of {self.ingredient.name} for {self.recipe.title}"

    # class Meta:
    #     db_table = 'app_recipe_ingredients'


# 8. Các bước nấu ăn
class Step(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='steps')
    order = models.PositiveSmallIntegerField(verbose_name="Bước")
    description = models.TextField(verbose_name="Mô tả")
    image = CloudinaryField('ảnh', null=True, blank=True)

    class Meta:
        ordering = ['order']
        verbose_name = "Bước"  # tên số ít
        verbose_name_plural = "Các bước"  # tên số nhiều


# 9. Bình luận
class Comment(TimeStampedModel):
    status = models.SmallIntegerField(choices=CommentStatus.choices, default=CommentStatus.ACTIVE, db_index=True,
                                      verbose_name="Trạng thái")
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(verbose_name="nội dung")
    reactions = GenericRelation('Reaction', verbose_name="Phản ứng")
    reports = GenericRelation('Report', verbose_name="Báo cáo")

    parent = models.ForeignKey(
        'self',
        null=True,
        blank=True,
        on_delete=models.CASCADE,
        related_name='replies',
        verbose_name='Bình luận cha'
    )

    def is_reply(self):
        return self.parent is not None

    def __str__(self):
        return self.content

    class Meta:
        verbose_name = "Bình luận"  # tên số ít
        verbose_name_plural = "Các bình luận"  # tên số nhiều


# 10. Phản ứng
class Reaction(TimeStampedModel):
    # recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name='likes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    emotion = models.SmallIntegerField(choices=EmotionType.choices, default=EmotionType.LIKE)
    # created_at = models.DateTimeField(auto_now_add=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    class Meta:
        unique_together = ('user', 'content_type', 'object_id')  # mỗi user chỉ like 1 lần


# 11. Báo cáo vi phạm
class Report(TimeStampedModel):
    reporter = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reports')
    reason = models.SmallIntegerField(choices=ReasonType.choices)
    description = models.TextField(blank=True)  # lý do chi tiết nếu cần
    status = models.SmallIntegerField(choices=ReportStatus.choices, default=ReportStatus.PENDING, db_index=True)

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')  # liên kết tới Recipe hoặc Comment

    # is_resolved = models.BooleanField(default=False)  # xử lý chưa

    def __str__(self):
        return f"{self.reporter} báo cáo {self.content_type} #{self.object_id}"


# 12. Thông báo
class Notification(TimeStampedModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=255, verbose_name="Tiêu đề")
    description = models.TextField(verbose_name="Mô tả")
    type = models.SmallIntegerField(choices=NotificationType.choices, default=NotificationType.SYSTEM,
                                    verbose_name="Kiểu thông báo")

    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')  # liên kết tới Recipe hoặc Comment

    # is_resolved = models.BooleanField(default=False)  # xử lý chưa

    def __str__(self):
        return f"{self.title}"


# 13. View
class RecipeView(TimeStampedModel):
    recipe = models.ForeignKey("Recipe", on_delete=models.CASCADE, related_name="views")
    ip_address = models.GenericIPAddressField()
    count = models.PositiveIntegerField(default=0)

    class Meta:
        unique_together = ("recipe", "ip_address")


# class View(models.Model):
#     user = models.ForeignKey(User, on_delete=models.CASCADE)
#     recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True, editable=False)
#
#     class Meta:
#         unique_together = ('recipe', 'user')

# 14. Đánh giá và bình luận
class RecipeReview(TimeStampedModel):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])  # 1 đến 5 sao
    comment = models.TextField(blank=True, null=True)

    class Meta:
        unique_together = ('recipe', 'user')  # Mỗi user chỉ được đánh giá 1 lần / recipe
