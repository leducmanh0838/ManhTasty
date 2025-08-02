from collections import defaultdict

from rest_framework import serializers
from app.models import Comment, EmotionType
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

class StoreCommentCreateSerializer(serializers.ModelSerializer):
    user=AvatarAndNameSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'parent', 'created_at']

class StoreCommentListSerializer(serializers.ModelSerializer):
    user=AvatarAndNameSerializer()
    # reply_count = serializers.SerializerMethodField()
    #
    # class Meta:
    #     model = Comment
    #     fields = ['id', 'user', 'content', 'created_at', 'reply_count']
    #
    # def get_reply_count(self, obj):
    #     return obj.replies.count()
    emotion_counts = serializers.SerializerMethodField()
    reply_count = serializers.IntegerField()
    current_emotion = serializers.SerializerMethodField()
    # user_name = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'content', 'user', 'created_at', 'emotion_counts', 'reply_count', 'current_emotion']

    def get_emotion_counts(self, obj):
        reactions = getattr(obj, 'prefetched_reactions', [])
        counts = defaultdict(int)
        for r in reactions:
            counts[r.emotion] += 1
        return counts

    def get_current_emotion(self, obj):
        reactions = getattr(obj, 'prefetched_reactions', [])
        request = self.context.get('request')
        user = getattr(request, 'user', None)

        if not user or not user.is_authenticated:
            return None  # 👈 Người dùng chưa đăng nhập thì không có cảm xúc

        for r in reactions:
            if r.user_id == user.id:
                return r.emotion

        return None  # 👈 Không có cảm xúc nào từng thả

class ChildCommentSerializer(serializers.ModelSerializer):
    user = AvatarAndNameSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at']