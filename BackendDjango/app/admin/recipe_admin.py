from django.contrib import admin
from django.db.models import Count
from django.shortcuts import redirect, render
from django.utils.html import format_html

from app.admin.in_line_admins import StepInlineAdmin, IngredientInline, TagInline, RecipeMediaInlineAdmin
from app.models import Recipe, RecipeStatus, Notification, NotificationType
from django import forms


# 1️⃣ Form nhập lý do khóa
class LockRecipeForm(forms.Form):
    description = forms.CharField(widget=forms.Textarea, label="Lý do khóa", required=True)


@admin.register(Recipe)
class RecipeAdmin(admin.ModelAdmin):
    list_display = ("id", "title", 'image_tag', "report_count", 'rating_avg', 'status')
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

    def report_list_link(self, obj):
        count = obj.reports.count()
        if count==0:
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
                '<a class="button" style="background-color:red;color:white;" href="/admin/app/recipe/{}/lock/">Khóa món ăn</a>',
                obj.id
            )
        return "Đã khóa"

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
            'form': form,
            'recipe': recipe,
            'opts': self.model._meta,
            'original': recipe,
        }
        return render(request, 'admin/lock_recipe_form.html', context)

    def rating_avg(self, obj):
        if obj.rating_count > 0:
            avg = obj.rating_sum / obj.rating_count
            return round(avg, 2)  # làm tròn 2 chữ số
        return 0

    rating_avg.short_description = "Điểm đánh giá trung bình"

    def image_tag(self, obj):
        if obj.image:
            return format_html('<img src="{}" width="100" style="border-radius:4px"/>', obj.image.url)
        return "-"

    image_tag.short_description = "Ảnh"

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(report_count_num=Count("reports"))
        return qs.order_by("-report_count_num")

    def report_count(self, obj):
        return obj.report_count_num

    report_count.short_description = "Số lượt báo cáo"
    report_count.admin_order_field = "report_count_num"

    # def lock_recipes(self, request, queryset):
    #     # bỏ annotate trước khi update
    #     ids = list(queryset.values_list('id', flat=True))  # convert QuerySet sang list
    #     Recipe.objects.filter(id__in=ids).update(status=RecipeStatus.LOCKED)
    #     self.message_user(request, f"{len(ids)} món ăn đã bị khóa")
    #
    # lock_recipes.short_description = "Khóa các Recipe đã chọn"

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
