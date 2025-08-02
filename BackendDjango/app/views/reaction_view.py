from rest_framework import mixins, viewsets
from rest_framework.permissions import IsAuthenticated

from app.models import Reaction
from app.permissions import IsOwnerOfReaction
from app.serializers.reaction_serializers import ReactionCreateSerializer


class ReactionViewSet(mixins.CreateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = Reaction.objects.all()
    serializer_class = ReactionCreateSerializer
    # permission_classes = [IsAuthenticated]

    def get_permissions(self):
        if self.action in ['create']:
            return [IsAuthenticated()]
        elif self.action in ['destroy']:
            return [IsAuthenticated(), IsOwnerOfReaction()]
        else:
            return [IsAuthenticated()]