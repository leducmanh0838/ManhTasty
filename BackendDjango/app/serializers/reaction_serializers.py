from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from app.models import Reaction, EmotionType

class ReactionSerializer(serializers.ModelSerializer):
    object_id = serializers.IntegerField()
    content_type = serializers.CharField()  # VD: 'recipe'
    emotion = serializers.ChoiceField(choices=EmotionType.choices)

    class Meta:
        model = Reaction
        fields = ['object_id', 'content_type', 'emotion']

    def validate_content_type(self, value):
        try:
            return ContentType.objects.get(model=value.lower())
        except ContentType.DoesNotExist:
            raise serializers.ValidationError("Invalid content_type")

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
