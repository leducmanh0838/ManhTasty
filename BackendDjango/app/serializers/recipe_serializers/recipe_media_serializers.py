from cloudinary.uploader import upload
from rest_framework import serializers

from app.models import RecipeMedia, MediaType
from app.utils.media import generate_public_id, detect_media_type


class RecipeMediaCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecipeMedia
        fields = ['id', 'recipe', 'media_type', 'file', 'order']
        read_only_fields = ['media_type']

    def create(self, validated_data):
        file = validated_data.pop('file')
        media_type = detect_media_type(file)

        if media_type == MediaType.VIDEO:
            resource_type = "video"
        else:
            resource_type = "image"  # cho IMAGE và GIF

        upload_result = upload(
            file,
            public_id=f"recipes/medias/{MediaType(media_type).label.lower()+'s'}/{generate_public_id()}",
            resource_type=resource_type
        )
        validated_data['file'] = upload_result['public_id']
        validated_data['media_type'] = media_type
        return super().create(validated_data)