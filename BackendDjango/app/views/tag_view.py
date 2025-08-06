from rest_framework import mixins, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated

from app.models import Tag
from app.serializers.report_serializers import ReportCreateSerializer
from app.serializers.tag_serializers import TagSerializer


class TagViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    queryset = Tag.objects.all()
    serializer_class =TagSerializer
    def get_queryset(self):
        if self.action == 'list':
            queries = self.queryset
            tag_category = self.request.query_params.get('tag_category')
            if tag_category:
                queries = queries.filter(tag_category=int(tag_category))

            return queries