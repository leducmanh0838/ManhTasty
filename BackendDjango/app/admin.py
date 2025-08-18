from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

from app.models import User, Tag, Report, Ingredient, Recipe


# Register your models here.

class MyUserAdmin(UserAdmin):
    list_display = ['username','first_name', 'last_name']
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

admin.site.register(User, MyUserAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Ingredient)
admin.site.register(Recipe)
admin.site.register(Report)