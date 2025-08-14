from django.contrib.contenttypes.models import ContentType
from django.db.models import Q, Count, Prefetch
from rest_framework import parsers, mixins, viewsets
from rest_framework.decorators import action

from app.models import Recipe, RecipeStatus, Reaction, EmotionType, Comment
from app.paginations import RecipePagination, CommentPagination
from app.permissions import IsAuthor
from app.serializers.comment_serializers import StoreCommentCreateSerializer, StoreCommentListSerializer
from app.serializers.recipe_media_serializers import RecipeMediaCreateSerializer
from app.serializers.recipe_serializers import RecipeCreateSerializer, RecipeBasicSerializer, RecipeRetrieveSerializer, \
    RecipeSummarySerializer
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

from app.serializers.step_serializers import StepCreateSerializer
from app.utils.mongodb import log_user_search_keyword
from app.utils.paginationUtils import get_pagination_links
from app.utils.whoosh_utils.common_whoosh_utils import search_recipes


class RecipeViewSet(mixins.CreateModelMixin,
                    mixins.ListModelMixin,
                    mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):
    pagination_class = RecipePagination
    def get_serializer_class(self):
        if self.action == 'create':
            return RecipeCreateSerializer
        elif self.action == 'list':
            return RecipeBasicSerializer
        elif self.action == 'retrieve':
            return RecipeRetrieveSerializer
        return RecipeBasicSerializer  # fallback
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
        if self.action in ['create', 'get_current_emotion']:
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
    # def create(self, request, *args, **kwargs):
    #     response = super().create(request, *args, **kwargs)
    #     recipe_id = response.data.get('id')  # hoặc sửa serializer để trả về id
    #     return Response({"message": "Recipe created successfully", "recipe_id": recipe_id}, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['get'], url_path='search')
    def search_recipes(self, request):
        keyword = request.query_params.get('keyword', '').strip()
        print("keyword: ", keyword)
        if keyword:
            if request.user.is_authenticated:
                log_user_search_keyword(user=request.user, keyword=keyword)
        page = int(request.query_params.get('page', 1))

        # Gọi hàm tìm kiếm
        result = search_recipes(keyword, page)

        # Truy vấn lại từ DB để lấy đầy đủ dữ liệu (ảnh, tags, v.v.)
        ids = [r["id"] for r in result["recipes"]]

        recipes = Recipe.objects.filter(id__in=ids).order_by('-id')

        if not recipes.exists():
            return Response({
                    "detail": "Invalid page."
                }, status=status.HTTP_404_NOT_FOUND)

        total_pages = result["total_pages"]

        pagination_links=get_pagination_links(base_url=request.build_absolute_uri(request.path), total_pages=total_pages, **request.query_params.dict())
        print("pagination_links: ", pagination_links)

        # Serialize kết quả
        serializer = RecipeSummarySerializer(recipes, many=True)

        return Response({
            "count": result["total"],
            "next": pagination_links["next"],
            "previous": pagination_links["previous"],
            "results": serializer.data
        }, status=status.HTTP_200_OK)

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

    @action(detail=True, methods=['get'], url_path='current-emotion')
    def get_current_emotion(self, request, pk):
        # recipe = self.get_object()
        # self.check_object_permissions(request, recipe)

        content_type = ContentType.objects.get_for_model(Recipe)
        try:
            reaction = Reaction.objects.get(
                content_type=content_type,
                object_id=pk,
                user=request.user
            )
            # emotion = reaction.emotion
        except Reaction.DoesNotExist:
            return Response({})

        return Response({
            "emotion": reaction.emotion,
            "id": reaction.id,

        })

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

    def get_serializer_context(self):
        context = super().get_serializer_context()

        if self.action == 'list':
            context['request'] = self.request

        return context

    def get_queryset(self):
        if self.action == 'list':
            recipe_id = self.kwargs['recipe_pk']
            comment_ct = ContentType.objects.get_for_model(Comment)

            # Prefetch tất cả reaction cho comments
            reactions = Reaction.objects.filter(content_type=comment_ct)

            return Comment.objects.filter(
                recipe_id=recipe_id,
                parent__isnull=True
            ).annotate(
                reply_count=Count('replies')
            ).prefetch_related(
                Prefetch('reactions', queryset=reactions, to_attr='prefetched_reactions'),
            ).select_related('user').order_by('-id')
        if self.action == 'create':
            recipe_id = self.kwargs['recipe_pk']
            return Comment.objects.filter(recipe_id=recipe_id, parent__isnull=True).order_by('-id')

    def perform_create(self, serializer):
        recipe_id = self.kwargs['recipe_pk']
        serializer.save(user=self.request.user, recipe_id=recipe_id)

