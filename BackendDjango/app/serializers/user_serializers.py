from rest_framework import serializers

from app.models import User


class AvatarAndNameSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'avatar', 'first_name', 'last_name']


# class UserSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = User
#         fields = ['id', 'avatar', 'first_name', 'last_name']