from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from app.models import Reaction, EmotionType

class ReactionCreateSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField()

    class Meta:
        model = Reaction
        fields = ['object_id', 'content_type', 'emotion']

    def validate_content_type(self, value):
        allowed_models = ['recipe', 'comment']
        model_name = value.lower()

        if model_name not in allowed_models:
            raise serializers.ValidationError("Only 'recipe' and 'comment' are allowed as content_type.")

        try:
            return ContentType.objects.get(model=model_name)
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content_type")

    def validate(self, attrs):
        content_type = attrs.get('content_type')
        object_id = attrs.get('object_id')

        # Trường hợp content_type đã được chuyển thành ContentType object ở bước validate_content_type
        if isinstance(content_type, str):
            try:
                content_type = ContentType.objects.get(model=content_type.lower())
            except ContentType.DoesNotExist:
                raise serializers.ValidationError({'content_type': 'Invalid content_type'})

        model_class = content_type.model_class()
        if not model_class.objects.filter(id=object_id).exists():
            raise serializers.ValidationError({'object_id': 'Object with this ID does not exist'})

        return attrs

    def create(self, validated_data):
        user = self.context['request'].user
        content_type = validated_data['content_type']
        object_id = validated_data['object_id']
        emotion = validated_data['emotion']

        reaction, created = Reaction.objects.get_or_create(
            user=user,
            content_type=content_type,
            object_id=object_id,
            defaults={'emotion': emotion}
        )

        if not created:
            reaction.emotion = emotion
            reaction.save()

        return reaction
