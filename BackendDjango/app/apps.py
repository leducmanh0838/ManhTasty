from django.apps import AppConfig

class AppConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'app'

    def ready(self):
        from app.recipe_search.indexing import build_index
        import threading

        # Dùng threading để tránh lỗi AppRegistryNotReady
        threading.Thread(target=build_index()).start()