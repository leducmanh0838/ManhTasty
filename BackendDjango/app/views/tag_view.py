from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from rest_framework import mixins, viewsets
from rest_framework.exceptions import ValidationError

from app.configs.values import CacheTimeout
from app.models import Tag
from app.paginations import CommonPagination
from app.serializers.tag_serializers import TagSerializer


class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    pagination_class = CommonPagination
    def get_queryset(self):
        if self.action == 'list':
            queries = self.queryset
            keyword = self.request.query_params.get('keyword')
            tag_category = self.request.query_params.get('tag_category')
            is_featured = self.request.query_params.get('is_featured')
            if keyword:
                queries = queries.filter(name__icontains=keyword)
            # else:
            #     raise ValidationError({"keyword": "This query parameter is required."})
            # tag_category = self.request.query_params.get('tag_category')
            if tag_category:
                queries = queries.filter(tag_category=int(tag_category))
            if is_featured:
                queries = queries.filter(is_featured=True)

            return queries

    # @method_decorator(cache_page(CacheTimeout.TAG_LIST_TIMEOUT))
    def list(self, request, *args, **kwargs):
        print(r"Đã truy vấn /tags/")
        return super().list(request, *args, **kwargs)