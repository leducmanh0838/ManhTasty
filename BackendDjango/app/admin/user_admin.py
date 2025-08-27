from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from app.admin.site import admin_site
from app.models import User


@admin.register(User, site=admin_site)
class MyUserAdmin(UserAdmin):
    list_display = ['username', 'first_name', 'last_name']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('username',)