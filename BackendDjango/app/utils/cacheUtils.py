from django.views.decorators.cache import cache_page


def conditional_cache_page(timeout, key_prefix=None):
    def decorator(view_func):
        def _wrapped_view(request, *args, **kwargs):
            # Nếu có skip_cache=true thì bỏ qua cache
            if request.GET.get("skip_cache") == "true":
                return view_func(request, *args, **kwargs)
            # Ngược lại thì vẫn dùng cache_page
            return cache_page(timeout, key_prefix=key_prefix)(view_func)(request, *args, **kwargs)
        return _wrapped_view
    return decorator