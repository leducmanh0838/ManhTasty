from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from app.models import User

# Register your models here.

class MyUserAdmin(UserAdmin):

    list_display = ['username','first_name', 'last_name']
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('username',)

admin.site.register(User, MyUserAdmin)