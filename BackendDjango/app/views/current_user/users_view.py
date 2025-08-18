from rest_framework import viewsets, mixins

from app.models import User
from app.serializers.user_serializers import AvatarAndNameSerializer


class UserViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin):
    queryset = User.objects.all()

    def get_serializer_class(self):
        return AvatarAndNameSerializer