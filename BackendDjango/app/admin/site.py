from dateutil.relativedelta import relativedelta
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.shortcuts import render
from django.urls import path
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from app.dao.stats.get_recipe_stats import get_recipe_stats
from datetime import datetime, timedelta

User = get_user_model()

# View thống kê

# def recipe_report_view(request):
#     by = request.GET.get("by", "month")
#     periods = int(request.GET.get("periods", 6))  # mặc định 6 đơn vị gần nhất
#
#     stats = get_recipe_stats(by=by, periods=periods)
#
#     if by == "day":
#         labels = [s["period"].strftime("%d/%m/%Y") for s in stats]
#     elif by == "month":
#         labels = [s["period"].strftime("%m/%Y") for s in stats]
#     elif by == "quarter":
#         labels = [f"Q{((s['period'].month-1)//3)+1}/{s['period'].year}" for s in stats]
#     elif by == "year":
#         labels = [s["period"].strftime("%Y") for s in stats]
#     else:
#         labels = [str(s["period"]) for s in stats]
#
#     if by in ["day", "month"]:
#         chart_type = "line" if len(stats) > 1 else "bar"
#     else:
#         chart_type = "bar"
#
#     values = [s["total"] for s in stats]
#
#     context = {
#         "title": "Thống kê công thức",
#         "labels": labels,
#         "values": values,
#         "by": by,
#         "chart_type": chart_type,
#         "periods": periods,
#     }
#     return render(request, "admin/recipe_reports.html", context)
# def recipe_report_view(request):
#     # Lấy thống kê 6 tháng gần nhất
#     stats = get_recipe_stats(by="day")
#
#     labels = [s["period"].strftime("%m/%Y") for s in stats]
#     values = [s["total"] for s in stats]
#
#     context = {
#         "title": "Thống kê công thức",
#         "labels": labels,
#         "values": values,
#     }
#     return render(request, "admin/recipe_reports.html", context)
    # total_users = User.objects.count()
    # total_recipes = Recipe.objects.count()
    # total_comments = Comment.objects.count()
    #
    # context = {
    #     "title": "Thống kê món ăn",
    #     "total_users": total_users,
    #     "total_recipes": total_recipes,
    #     "total_comments": total_comments,
    # }
    # return render(request, "admin/recipe_reports.html", context)


# AdminSite custom
class MyAdminSite(admin.AdminSite):
    site_header = "Hệ thống quản trị ManhTasty"
    site_title = "Admin | Món ăn"
    index_title = "Chào mừng đến với trang Admin"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path("reports/recipes/", self.admin_view(self.recipe_report_view), name="recipe-reports"),
        ]
        return custom_urls + urls

    def get_app_list(self, request, app_label=None):
        app_list = super().get_app_list(request)
        # Thêm menu custom
        app_list.insert(0, {
            'name': _('Báo cáo'),
            'app_label': 'reports',
            'models': [
                {
                    'name': _('Thống kê món ăn'),
                    'object_name': 'RecipeStats',
                    'admin_url': '/admin/reports/recipes/',
                    'add_url': None,
                    'view_only': True,
                },
            ],
        })
        return app_list

    def recipe_report_view(self, request):
        by = request.GET.get("by", "month")

        # Lấy start_date và end_date từ query string (vd: ?start=2024-01-01&end=2024-06-30)
        start = request.GET.get("start")
        end = request.GET.get("end")

        today = timezone.now().date()

        # start_date = datetime.strptime(start, "%Y-%m-%d").date() if start else None
        end_date = datetime.strptime(end, "%Y-%m-%d").date() if end else today
        if start:
            start_date = datetime.strptime(start, "%Y-%m-%d").date()
        else:
            if by == "day":
                start_date = today - timedelta(days=6)
            elif by == "month":
                start_date = today - relativedelta(months=6)
            elif by == "quarter":
                start_date = today - relativedelta(months=6 * 3)
            else:
                start_date = today - relativedelta(years=6)

        stats = get_recipe_stats(by=by, start_date=start_date, end_date=end_date)

        # format label theo loại thời gian
        if by == "day":
            labels = [s["period"].strftime("%d/%m/%Y") for s in stats]
        elif by == "month":
            labels = [s["period"].strftime("%m/%Y") for s in stats]
        elif by == "quarter":
            labels = [f"Q{((s['period'].month - 1) // 3) + 1}/{s['period'].year}" for s in stats]
        elif by == "year":
            labels = [s["period"].strftime("%Y") for s in stats]
        else:
            labels = [str(s["period"]) for s in stats]

        # chọn kiểu biểu đồ
        if by in ["day", "month"]:
            chart_type = "line" if len(stats) > 1 else "bar"
        else:
            chart_type = "bar"

        values = [s["total"] for s in stats]

        context = {
            **self.each_context(request),
            "title": "Thống kê số lượng công thức được đăng",
            "labels": labels,
            "values": values,
            "by": by,
            "chart_type": chart_type,
            "start_date": start_date,
            "end_date": end_date,
        }
        return render(request, "admin/recipe_reports.html", context)


# Dùng admin_site thay cho admin mặc định
admin_site = MyAdminSite(name="myadmin")