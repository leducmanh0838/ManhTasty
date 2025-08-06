from django.urls import path, include
from rest_framework_nested import routers

from app.views.comment_view import CommentViewSet
from app.views.reaction_view import ReactionViewSet
from app.views.recipe_view import RecipeViewSet, RecipeCommentViewSet
from app.views.report_view import ReportViewSet
from app.views.tag_view import TagViewSet
from app.views.user_view import LoginViewSet

# router = routers.DefaultRouter()
router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='login')
router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'reactions', ReactionViewSet, basename='reactions')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'tags', TagViewSet, basename='tags')

# Tạo nested router cho comments theo từng recipe
recipes_router = routers.NestedSimpleRouter(router, r'recipes', lookup='recipe')
recipes_router.register(r'comments', RecipeCommentViewSet, basename='recipe-comments')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(recipes_router.urls)),
    # path('recipes/create/', RecipeAPIView.as_view(), name='recipe'),
    # path('auth/google/', GoogleLoginAPIView.as_view(), name='user'),
    # path('auth/facebook/', FacebookLoginAPIView.as_view(), name='user2'),
]