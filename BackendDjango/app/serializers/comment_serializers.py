from rest_framework import serializers
from app.models import Comment
from app.serializers.user_serializers import AvatarAndNameSerializer


# class CommentSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Comment
#         fields = ['id', 'recipe', 'content', 'parent']
#         extra_kwargs = {
#             'recipe': {'required': True},
#             'parent': {'required': False, 'allow_null': True}
#         }
#
#     def create(self, validated_data):
#         user = self.context['request'].user
#         return Comment.objects.create(user=user, **validated_data)

class CommentSerializer(serializers.ModelSerializer):
    user=AvatarAndNameSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'parent', 'created_at']