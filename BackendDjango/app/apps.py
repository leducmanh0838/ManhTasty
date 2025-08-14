from django.apps import AppConfig


class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        import threading
        from app.utils.whoosh_utils.common_whoosh_utils import build_index

        # Dùng threading để tránh lỗi AppRegistryNotReady
        threading.Thread(target=build_index()).start()