from django.contrib import admin
from django.utils.html import format_html

from app.admin.site import admin_site
from app.models import Tag


@admin.register(Tag, site=admin_site)
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