from cloudinary.uploader import upload
from rest_framework import serializers

from app.models import Step
from app.utils.media import generate_public_id


class StepCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Step
        fields = ['id', 'recipe', 'order', 'description', 'image']

    def create(self, validated_data):
        image_file = validated_data.pop('image', None)
        if image_file:
            # Upload thủ công để chỉ định public_id
            upload_result = upload(
                image_file,
                public_id=f"steps/{generate_public_id()}"
            )
            validated_data['image'] = upload_result['public_id']
        return super().create(validated_data)