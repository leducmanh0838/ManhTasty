from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.db.models import Count
from django.utils.html import format_html

from app.models import User, Tag, Report, Ingredient, Recipe, Step, RecipeMedia, MediaType, RecipeStatus
from app.utils.media import full_media_url_by_public_id


# Register your models here.

class MyUserAdmin(UserAdmin):
    list_display = ['username', 'first_name', 'last_name']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('username',)


class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_tag_category_display', 'is_featured', 'image_preview')
    search_fields = ['name']
    list_filter = ['tag_category', 'is_featured']
    list_editable = ('is_featured',)
    readonly_fields = ('image_preview',)

    def get_tag_category_display(self, obj):
        return obj.get_tag_category_display()

    get_tag_category_display.short_description = 'Thể loại'

    def image_preview(self, obj):
        if obj.image:
            return format_html('<img src="{}" style="width: 60px; height: auto;" />', obj.image.url)
        return "-"

    image_preview.short_description = "Ảnh"


class TagInline(admin.TabularInline):  # hoặc StackedInline
    model = Recipe.tags.through


class IngredientInline(admin.TabularInline):
    model = Recipe.ingredients.through


class StepInlineAdmin(admin.TabularInline):
    model = Step
    fields = ("order", "description", "image_tag")  # hiển thị thêm ảnh
    readonly_fields = ("image_tag",)  # image_tag chỉ xem, không sửa

    def image_tag(self, obj):
        if obj.image:  # nếu có ảnh
            return format_html('<img src="{}" width="100" style="border-radius:4px"/>', obj.image.url)
        return "-"

    image_tag.short_description = "Ảnh"


class RecipeMediaInlineAdmin(admin.TabularInline):
    model = RecipeMedia
    fields = ("file_tag",)
    readonly_fields = ("file_tag",)

    def file_tag(self, obj):
        if obj.file:  # nếu có ảnh
            url = str(full_media_url_by_public_id(obj.file, obj.media_type))
            if obj.media_type != MediaType.VIDEO:
                return format_html('<img src="{}" width="200" style="border-radius:4px"/>', url)
            else:
                return format_html(
                    '<video width="200" controls style="border-radius:4px">'
                    '  <source src="{}" type="video/mp4">'
                    '  Trình duyệt của bạn không hỗ trợ video.'
                    '</video>', url)
        return "-"

    file_tag.short_description = "Ảnh hoặc video"


class RecipeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", 'image_tag', "report_count", 'rating_avg', 'status')
    list_display_links = ("id", "title", 'image_tag')
    list_filter = ("status",)
    readonly_fields = ('image_tag', 'rating_avg')
    search_fields = ['title']
    actions = ["lock_recipes"]
    inlines = [StepInlineAdmin, IngredientInline, TagInline, RecipeMediaInlineAdmin]

    def get_fields(self, request, obj=None):
        # Lấy tất cả field của model
        fields = [f.name for f in self.model._meta.get_fields() if f.concrete and not f.many_to_many]
        # Loại bỏ field 'image'
        fields.remove('image')
        fields.remove('rating_sum')
        # fields.append('rating_avg')
        fields.insert(10, 'rating_avg')
        # Thêm image_preview vào cuối
        fields.append('image_tag')
        return fields

    def rating_avg(self, obj):
        if obj.rating_count > 0:
            avg = obj.rating_sum / obj.rating_count
            return round(avg, 2)  # làm tròn 2 chữ số
        return 0

    rating_avg.short_description = "Điểm đánh giá trung bình"

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" style="border-radius:4px"/>', obj.image.url)
        return "-"

    image_tag.short_description = "Ảnh"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(report_count_num=Count("reports"))
        return qs.order_by("-report_count_num")

    def report_count(self, obj):
        return obj.report_count_num

    report_count.short_description = "Số lượt báo cáo"
    report_count.admin_order_field = "report_count_num"

    def lock_recipes(self, request, queryset):
        # bỏ annotate trước khi update
        ids = list(queryset.values_list('id', flat=True))  # convert QuerySet sang list
        Recipe.objects.filter(id__in=ids).update(status=RecipeStatus.LOCKED)
        self.message_user(request, f"{len(ids)} món ăn đã bị khóa")

    lock_recipes.short_description = "Khóa các Recipe đã chọn"

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False


admin.site.register(User, MyUserAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Ingredient)
admin.site.register(Recipe, RecipeAdmin)
admin.site.register(Report)
