from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from app.models import Report
from app.serializers.report_serializers import ReportCreateSerializer


class ReportViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Report.objects.all()
    serializer_class = ReportCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(reporter=self.request.user)