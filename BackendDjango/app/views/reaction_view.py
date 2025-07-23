from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from app.models import Reaction
from app.serializers.reaction_serializers import ReactionSerializer


class ReactionViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionSerializer
    permission_classes = [IsAuthenticated]