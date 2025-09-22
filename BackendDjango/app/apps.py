from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    # def ready(self):
    #     from django_q.tasks import schedule
    #     from django_q.models import Schedule
    #     # Chỉ tạo schedule nếu chưa có
    #     Schedule.objects.filter(func='app.tasks.my_task').delete()
    #
    #     # Tạo lại schedule mới
    #     schedule(
    #         'app.tasks.my_task',
    #         schedule_type=Schedule.MINUTES,  # chạy theo phút
    #         minutes=0.1,  # 6 giây
    #         repeats=-1  # -1 nghĩa là lặp vô hạn
    #     )

    def ready(self):
        import threading
        from app.utils.whoosh_utils.common_whoosh_utils import build_index
        from django_q.tasks import schedule

        # Dùng threading để tránh lỗi AppRegistryNotReady
        threading.Thread(target=build_index()).start()

        from django_q.models import Schedule

        # Chỉ tạo schedule nếu chưa có
        Schedule.objects.filter(func='app.tasks.clean_deleted_recipes').delete()

        # Tạo lại schedule mới
        schedule(
            'app.tasks.clean_deleted_recipes',
            schedule_type=Schedule.MINUTES,  # chạy theo phút
            minutes=0.1,  # 6 giây
            repeats=-1  # -1 nghĩa là lặp vô hạn
        )