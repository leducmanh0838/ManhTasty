from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from app.models import User, Tag, Report


# Register your models here.

class MyUserAdmin(UserAdmin):
    list_display = ['username','first_name', 'last_name']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('username',)

class TagAdmin(admin.ModelAdmin):
    list_display = ('name', 'get_tag_category_display')

    def get_tag_category_display(self, obj):
        return obj.get_tag_category_display()
    get_tag_category_display.short_description = 'Thể loại'

admin.site.register(User, MyUserAdmin)
admin.site.register(Tag, TagAdmin)
admin.site.register(Report)