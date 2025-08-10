import cloudinary
from rest_framework import viewsets, status
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.models import MediaType
from app.utils.media import generate_public_id, detect_media_type


class MediaUploadViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser]
    def create(self, request):
        file = request.FILES.get('file')
        parent_type = request.data.get('parent_type')

        if not file:
            return Response({'detail': 'No image provided'}, status=400)

        try:
            media_type = detect_media_type(file)

            if media_type == MediaType.VIDEO:
                resource_type = "video"
            else:
                resource_type = "image"  # cho IMAGE và GIF

            # Upload lên Cloudinary
            upload_result = cloudinary.uploader.upload(
                file,
                public_id=f"recipes/{generate_public_id()}",
                resource_type=resource_type
            )

            media_url = upload_result.get('secure_url')
            public_id = upload_result.get('public_id')

            return Response({
                'src': public_id,
                'type': media_type,
                # 'public_id': public_id
                # 'public_id': public_id,
                'parent_type': parent_type,
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=500)