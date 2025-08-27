from django.contrib import admin

from .recipe_admin import RecipeAdmin
from .user_admin import MyUserAdmin
from .tag_admin import TagAdmin
from .comment_admin import CommentAdmin

# admin.site.site_header = "Hệ thống quản trị ManhTasty"  # tên trên thanh header
# admin.site.site_title = "Admin | Món ăn"             # tiêu đề trình duyệt
# admin.site.index_title = "Chào mừng đến với trang Admin"  # tiêu đề trang chí