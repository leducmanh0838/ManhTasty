from django.contrib import admin
from django.db.models import Count
from django.shortcuts import redirect, render
from django.utils.html import format_html

from app.models import Comment, CommentStatus, Notification, NotificationType
from django import forms

class LockRecipeForm(forms.Form):
    description = forms.CharField(widget=forms.Textarea, label="Lý do khóa", required=True)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "user_name", "user_avatar", "recipe", "short_content", "short_parent", "report_count", 'status')
    list_display_links = ("id", "user_name", 'user_avatar')
    readonly_fields = ('lock_button', 'report_list_link')

    def get_fields(self, request, obj=None):
        # Lấy tất cả field của model
        fields = [f.name for f in self.model._meta.get_fields() if f.concrete and not f.many_to_many]
        # Loại bỏ field 'image'
        fields.remove('user')
        fields.append('user_name')
        fields.append('user_avatar')
        fields.append('lock_button')
        fields.append('report_list_link')
        return fields

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        qs = qs.annotate(report_count_num=Count("reports"))
        return qs.order_by("-report_count_num")

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:comment_id>/lock/',
                self.admin_site.admin_view(self.lock_comment),
                name='comment-lock',
            ),
            path(
                '<int:comment_id>/reports/',
                self.admin_site.admin_view(self.view_reports),
                name='comment-reports',
            ),
        ]
        return custom_urls + urls

    # Hiển thị tên người dùng
    def user_name(self, obj):
        return obj.user.get_full_name() or obj.user.username

    user_name.short_description = "Tên người dùng"

    # Hiển thị avatar người dùng
    def user_avatar(self, obj):
        if obj.user.avatar:  # giả sử user.avatar là ImageField hoặc URL
            return format_html('<img src="{}" width="30" height="30" style="border-radius:50%;" />',
                               obj.user.avatar)
        return "-"

    user_avatar.short_description = "Avatar"

    # Hiển thị content rút gọn
    def short_content(self, obj):
        if len(obj.content) > 30:  # hiển thị tối đa 30 ký tự
            return f"{obj.content[:30]}..."
        return obj.content

    short_content.short_description = "Nội dung"

    # Hiển thị parent comment rút gọn
    def short_parent(self, obj):
        if obj.parent:
            text = obj.parent.content
            if len(text) > 30:
                return f"{text[:30]}..."
            return text
        return "-"

    short_parent.short_description = "Bình luận cha"

    def report_count(self, obj):
        return obj.report_count_num

    report_count.short_description = "Số lượt báo cáo"
    report_count.admin_order_field = "report_count_num"

    # Nút khóa
    def lock_button(self, obj):
        if obj and obj.status != CommentStatus.LOCKED:
            return format_html(
                '<a class="button" style="background-color:red;color:white;" href="/admin/app/comment/{}/lock/">Khóa bình luận</a>',
                obj.id
            )
        return "Đã khóa"

    lock_button.short_description = "Khóa bình luận"

    def report_list_link(self, obj):
        count = obj.reports.count()
        if count==0:
            return format_html("<p>Chưa có báo cáo nào</p>")
        return format_html(
                '<a href="/admin/app/comment/{}/reports/">{} lượt báo cáo</a>',
             obj.id, count,
            )

    report_list_link.short_description = "Danh sách báo cáo"

    def lock_comment(self, request, comment_id):
        comment = Comment.objects.get(id=comment_id)

        if request.method == 'POST':
            form = LockRecipeForm(request.POST)
            if form.is_valid():
                comment.status = CommentStatus.LOCKED  # hoặc RecipeStatus.LOCKED
                comment.save()

                # Lưu mô tả vào Notification hoặc log
                description = form.cleaned_data['description']
                Notification.objects.create(
                    user=comment.user,
                    title=f"Bình luận trong bài viết '{comment.recipe.title}' bị khóa",
                    description=description,
                    content_object=comment,
                    type=NotificationType.REPORT_COMMENT
                )

                self.message_user(request, f"Bình luận trong bài viết '{comment.recipe.title}' đã bị khóa.")
                return redirect(
                    f'/admin/{self.model._meta.app_label}/{self.model._meta.model_name}/{comment_id}/change/')
        else:
            form = LockRecipeForm()

        # Render form custom
        context = {
            'form': form,
            'comment': comment,
            'opts': self.model._meta,
            'original': comment,
        }
        return render(request, 'admin/lock_recipe_form.html', context)

    # View hiển thị danh sách report
    def view_reports(self, request, comment_id):
        comment = self.get_object(request, comment_id)
        reports = comment.reports.all().order_by('-id')  # tất cả report cho comment
        context = {
            'comment': comment,
            'reports': reports,
            'opts': self.model._meta,
        }
        return render(request, 'admin/comment_report_list.html', context)

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False
