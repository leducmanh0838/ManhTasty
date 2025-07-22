from rest_framework import parsers, mixins, viewsets
from app.serializers.recipe_serializers import RecipeCreateSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status


class RecipeViewSet(mixins.CreateModelMixin, viewsets.GenericViewSet):
    serializer_class = RecipeCreateSerializer
    parser_classes = [parsers.MultiPartParser]

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    # def perform_create(self, serializer):
    #     # Tự động truyền user vào serializer.create()
    #     serializer.save(author=self.request.user)

    def create(self, request, *args, **kwargs):
        """Override để chỉnh lại response nếu muốn"""
        response = super().create(request, *args, **kwargs)
        print(f'response.data: {response.data}')
        recipe_id = response.data.get('id')  # hoặc sửa serializer để trả về id
        return Response({"message": "Recipe created successfully", "recipe_id": recipe_id}, status=status.HTTP_201_CREATED)