from datetime import datetime, timedelta

from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from app.utils.mongodb import get_recent_popular_keywords


class SearchViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['get'], url_path='popular-keywords')
    def get_popular_keywords(self, request):
        return Response(get_recent_popular_keywords(10, datetime.now() - timedelta(days=1)))