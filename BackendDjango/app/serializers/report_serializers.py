from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from app.models import Report


class ReportCreateSerializer(serializers.ModelSerializer):
    content_type = serializers.CharField()  # VD: 'recipe'

    class Meta:
        model = Report
        fields = ['object_id', 'content_type', 'reason', 'description']

    def validate_content_type(self, value):
        try:
            return ContentType.objects.get(model=value.lower())
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

    # def create(self, validated_data):
    #     user = self.context['request'].user
    #     content_type = validated_data['content_type']
    #     object_id = validated_data['object_id']
    #     emotion = validated_data['emotion']
    #
    #     reaction, created = Reaction.objects.get_or_create(
    #         user=user,
    #         content_type=content_type,
    #         object_id=object_id,
    #         defaults={'emotion': emotion}
    #     )
    #
    #     if not created:
    #         reaction.emotion = emotion
    #         reaction.save()
    #
    #     return reaction
