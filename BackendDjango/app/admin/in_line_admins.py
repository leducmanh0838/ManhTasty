from django.contrib import admin
from django.utils.html import format_html

from app.models import Recipe, Step, RecipeMedia, MediaType, Report
from app.utils.media import full_media_url_by_public_id


class TagInline(admin.TabularInline):  # hoặc StackedInline
    model = Recipe.tags.through


class IngredientInline(admin.TabularInline):
    model = Recipe.ingredients.through


class ReportInlineAdmin(admin.TabularInline):
    model = Report
    fields = ("reporter", "reason", "description")  # hiển thị thêm ảnh
    # readonly_fields = ("image_tag",)  # image_tag chỉ xem, không sửa
    # def image_tag(self, obj):
    #     if obj.image:  # nếu có ảnh
    #         return format_html('<img src="{}" width="100" style="border-radius:4px"/>', obj.image.url)
    #     return "-"
    #
    # image_tag.short_description = "Ảnh"


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
