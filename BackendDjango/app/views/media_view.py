import cloudinary
from rest_framework import viewsets, status
from rest_framework.response import Response


class ImageUploadViewSet(viewsets.GenericViewSet):
    def create(self, request):
        image_file = request.FILES.get('image')

        if not image_file:
            return Response({'detail': 'No image provided'}, status=400)

        try:
            # Upload lên Cloudinary
            upload_result = cloudinary.uploader.upload(image_file)

            image_url = upload_result.get('secure_url')
            public_id = upload_result.get('public_id')

            return Response({
                'image_url': image_url,
                'public_id': public_id
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({'detail': str(e)}, status=500)