from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html

from app.admin.site import admin_site
from app.models import User


@admin.register(User, site=admin_site)
class MyUserAdmin(UserAdmin):
    list_display = ['username', 'first_name', 'last_name', 'avatar_tag', 'email', 'is_active']
    list_editable = ['is_active']
    readonly_fields = ('avatar_tag',)
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('username',)

    def avatar_tag(self, obj):
        if obj.avatar:
            return format_html('<img src="{}" width="50" style="border-radius:4px"/>', obj.avatar)
        return "-"

    avatar_tag.short_description = "Avatar"

    def has_delete_permission(self, request, obj=None):
        return False