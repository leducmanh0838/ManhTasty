from datetime import datetime, timedelta

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from app.utils.mongo_db_utils.search_utils import get_recent_popular_keywords


class SearchViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='popular-keywords')
    def get_popular_keywords(self, request):
        keyword = request.query_params.get('keyword')
        since_date = datetime.now() - timedelta(days=7)
        return Response(get_recent_popular_keywords(since=since_date, limit=15, kw=keyword))