import json

from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, Count
from rest_framework import parsers, mixins, viewsets
from rest_framework.decorators import action

from app.models import Recipe, RecipeStatus, Reaction, EmotionType, Comment
from app.paginations import RecipePagination, CommentPagination
from app.permissions import IsAuthor
from app.serializers.comment_serializers import StoreCommentCreateSerializer, StoreCommentListSerializer
from app.serializers.recipe_media_serializers import RecipeMediaCreateSerializer
from app.serializers.recipe_serializers import RecipeCreateSerializer, RecipeListSerializer, RecipeRetrieveSerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from app.serializers.step_serializers import StepCreateSerializer


class RecipeViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):
    pagination_class = RecipePagination
    def get_serializer_class(self):
        if self.action == 'create':
            return RecipeCreateSerializer
        elif self.action == 'list':
            return RecipeListSerializer
        elif self.action == 'retrieve':
            return RecipeRetrieveSerializer
        return RecipeListSerializer  # fallback
    parser_classes = [parsers.MultiPartParser]

    def get_queryset(self):
        user = self.request.user
        qs = Recipe.objects.all()

        # Admin thấy tất cả
        if user.is_authenticated and user.is_staff:
            return qs
        # Tác giả thấy công thức của mình + các công thức công khai
        if user.is_authenticated:
            return qs.filter(Q(status=RecipeStatus.ACTIVE) | Q(author=user))

        # Khách (chưa đăng nhập) chỉ thấy công khai
        return qs.filter(status=RecipeStatus.ACTIVE)

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated()]
        elif self.action in ['create_step', 'submit_recipe']:
            return [IsAuthor()]
        else:
            return [AllowAny()]

    # def get_permissions(self):
    #     if self.request.method == 'POST':
    #         return [IsAuthenticated()]
    #     return [AllowAny()]

    # def perform_create(self, serializer):
    #     # Tự động truyền user vào serializer.create()
    #     serializer.save(author=self.request.user)

    # @action(detail=False, methods=['post'], url_path='creating')
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        recipe_id = response.data.get('id')  # hoặc sửa serializer để trả về id
        return Response({"message": "Recipe created successfully", "recipe_id": recipe_id}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'], url_path='steps')
    def create_step(self, request, pk):
        recipe = self.get_object()
        # if recipe.author != request.user:
        #     return Response({'detail': 'Bạn không có quyền'},
        #                     status=status.HTTP_403_FORBIDDEN)
        # print(json.dumps(request.user, indent=4, ensure_ascii=False))
        self.check_object_permissions(request, recipe)
        data = request.data.copy()
        data['recipe'] = recipe.id
        serializer = StepCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='medias')
    def create_media(self, request, pk):
        recipe = self.get_object()
        self.check_object_permissions(request, recipe)
        data = request.data.copy()
        data['recipe'] = recipe.id
        serializer = RecipeMediaCreateSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['patch'], url_path='submit')
    def submit_recipe(self, request, pk=None):
        recipe = self.get_object()
        self.check_object_permissions(request, recipe)

        # if recipe.status not in [RecipeStatus.CREATING, RecipeStatus.DRAFT]:
        #     return Response(
        #         {"detail": "Only recipes in 'Creating' or 'Draft' status can be submitted."},
        #         status=status.HTTP_400_BAD_REQUEST
        #     )

        if recipe.status != RecipeStatus.CREATING:
            return Response({"detail": "Recipe is not in CREATING status."}, status=400)

        # Kiểm tra điều kiện đủ (bạn có thể kiểm tra: có step chưa? có ảnh chưa? ...)
        if not recipe.steps.exists():
            return Response({"detail": "You must add at least one step."}, status=400)

        recipe.status = RecipeStatus.ACTIVE
        recipe.save()
        return Response({"detail": "Recipe submitted successfully."})

    @action(detail=True, methods=['get'], url_path='emotion-counts')
    def emotion_counts(self, request, pk):
        recipe_type = ContentType.objects.get_for_model(Recipe)

        # DB tự đếm số lượng mỗi emotion
        queryset = (
            Reaction.objects
            .filter(content_type=recipe_type, object_id=pk)
            .values('emotion')
            .annotate(count=Count('id'))
        )

        # Khởi tạo dict mặc định
        emotion_counts = {emotion.value: 0 for emotion in EmotionType}

        # Gán kết quả từ queryset
        for item in queryset:
            emotion_value = item['emotion']
            emotion_counts[emotion_value] = item['count']

        return Response(emotion_counts)


class RecipeCommentViewSet(mixins.ListModelMixin,
                     mixins.CreateModelMixin,
                     viewsets.GenericViewSet):
    # serializer_class = StoreCommentCreateSerializer
    pagination_class = CommentPagination
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_serializer_class(self):
        if self.action == 'create':
            return StoreCommentCreateSerializer
        elif self.action == 'list':
            return StoreCommentListSerializer
        return StoreCommentListSerializer  # fallback

    def get_queryset(self):
        recipe_id = self.kwargs['recipe_pk']
        return Comment.objects.filter(recipe_id=recipe_id, parent__isnull=True).order_by('-id')

    def perform_create(self, serializer):
        recipe_id = self.kwargs['recipe_pk']
        serializer.save(user=self.request.user, recipe_id=recipe_id)