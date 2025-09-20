from django.contrib import admin
from django.db.models import Count, Case, When, ExpressionWrapper, F, FloatField
from django.shortcuts import redirect, render
from django.utils.html import format_html

from app.admin.in_line_admins import StepInlineAdmin, IngredientInline, TagInline, RecipeMediaInlineAdmin
from app.admin.site import admin_site
from app.models import Recipe, RecipeStatus, Notification, NotificationType
from django import forms


# 1️⃣ Form nhập lý do khóa
# class LockRecipeForm(forms.Form):
#     description = forms.CharField(widget=forms.Textarea, label="Lý do khóa", required=True)
class LockRecipeForm(forms.Form):
    description = forms.CharField(
        label="Lý do khóa",
        required=True,
        widget=forms.Textarea(
            attrs={
                "class": "form-control",
                "rows": 3,
                "placeholder": "Nhập lý do khóa..."
            }
        ),
    )


@admin.register(Recipe, site=admin_site)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", 'image_tag', "report_count", 'view_count', 'comment_count', 'rating_avg', 'status')
    list_display_links = ("id", "title", 'image_tag')
    list_filter = ("status",)
    readonly_fields = ('image_tag', 'rating_avg', "lock_button", "report_count", "report_list_link")
    search_fields = ['title']
    # actions = ["lock_recipes"]
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
        fields.append('lock_button')
        # fields.append('report_count')
        fields.append('report_list_link')
        return fields

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(
            report_count_num=Count("reports", distinct=True),
            comment_count_num=Count("comments"),
            rating_avg_num=Case(  # tránh chia 0
                When(rating_count__gt=0,
                     then=ExpressionWrapper(
                         F("rating_sum") * 1.0 / F("rating_count"),
                         output_field=FloatField(),
                     )),
                default=0.0,
                output_field=FloatField(),
            )
        )
        return qs.order_by("-report_count_num")

    def report_list_link(self, obj):
        count = obj.reports.count()
        if count == 0:
            return format_html("<p>Chưa có báo cáo nào</p>")
        return format_html(
            '<a href="/admin/app/recipe/{}/reports/">{} lượt báo cáo</a>',
            obj.id, count,
        )

    report_list_link.short_description = "Danh sách báo cáo"

    # Nút khóa
    def lock_button(self, obj):
        if obj and obj.status != RecipeStatus.LOCKED:
            return format_html(
                '<a class="btn btn-danger btn-sm" href="/admin/app/recipe/{}/lock/">Khóa món ăn</a>',
                obj.id
            )
        return format_html('<span class="text-danger fw-bold">Đã khóa</span>')

    lock_button.short_description = "Khóa món ăn"

    # 4️⃣ URL custom
    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:recipe_id>/lock/',
                self.admin_site.admin_view(self.lock_recipe),
                name='recipe-lock',
            ),
            path(
                '<int:recipe_id>/reports/',
                self.admin_site.admin_view(self.view_reports),
                name='recipe-reports',
            ),
        ]
        return custom_urls + urls

    # View hiển thị danh sách report
    def view_reports(self, request, recipe_id):
        recipe = self.get_object(request, recipe_id)
        reports = recipe.reports.all().order_by('-id')  # tất cả report cho recipe
        context = {
            **self.admin_site.each_context(request),
            'recipe': recipe,
            'reports': reports,
            'opts': self.model._meta,
        }
        return render(request, 'admin/recipe_report_list.html', context)

    # 5️⃣ View xử lý
    def lock_recipe(self, request, recipe_id):
        recipe = Recipe.objects.get(id=recipe_id)

        if request.method == 'POST':
            form = LockRecipeForm(request.POST)
            if form.is_valid():
                recipe.status = RecipeStatus.LOCKED  # hoặc RecipeStatus.LOCKED
                recipe.save()

                # Lưu mô tả vào Notification hoặc log
                description = form.cleaned_data['description']
                Notification.objects.create(
                    user=recipe.author,
                    title=f"Món ăn '{recipe.title}' bị khóa",
                    description=description,
                    content_object=recipe,
                    type=NotificationType.REPORT_RECIPE
                )

                self.message_user(request, f"Recipe '{recipe.title}' đã bị khóa.")
                return redirect(
                    f'/admin/{self.model._meta.app_label}/{self.model._meta.model_name}/{recipe_id}/change/')
        else:
            form = LockRecipeForm()

        # Render form custom
        context = {
            **self.admin_site.each_context(request),
            'form': form,
            'recipe': recipe,
            'opts': self.model._meta,
            'original': recipe,
        }
        return render(request, 'admin/lock_recipe_form.html', context)

    def rating_avg(self, obj):
        return round(obj.rating_avg_num, 2)

    rating_avg.short_description = "Điểm đánh giá trung bình"
    rating_avg.admin_order_field = "rating_avg_num"  # 👈 Cho phép sort

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" style="border-radius:4px"/>', obj.image.url)
        return "-"

    image_tag.short_description = "Ảnh"

    def report_count(self, obj):
        return obj.report_count_num

    report_count.short_description = "Số lượt báo cáo"
    report_count.admin_order_field = "report_count_num"

    def comment_count(self, obj):
        return obj.comment_count_num

    comment_count.short_description = "Lượt bình luận"
    comment_count.admin_order_field = "comment_count_num"

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
