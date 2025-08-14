from django.urls import path, include
from rest_framework_nested import routers

from app.views.comment_view import CommentViewSet
from app.views.current_user.user_recipes_view import UserRecipesViewSet
from app.views.current_user.users_view import UserViewSet
from app.views.ingredient_view import IngredientViewSet
from app.views.media_view import MediaUploadViewSet
from app.views.reaction_view import ReactionViewSet
from app.views.recipe_views.recipe_draft_view import RecipeDraftViewSet
from app.views.recipe_views.recipe_view import RecipeViewSet, RecipeCommentViewSet
from app.views.report_view import ReportViewSet
from app.views.search_view import SearchViewSet
from app.views.tag_view import TagViewSet
from app.views.login_view import LoginViewSet
from app.views.current_user.user_search_view import CurrentUserSearchViewSet

# router = routers.DefaultRouter()
router = routers.SimpleRouter()
router.register(r'login', LoginViewSet, basename='login')
router.register(r'search', SearchViewSet, basename='search')

router.register(r'recipes', RecipeViewSet, basename='recipes')
router.register(r'recipes-draft', RecipeDraftViewSet, basename='draft-recipes')
# router.register(r'draft', RecipeDraftViewSet, basename='draft')
router.register(r'reactions', ReactionViewSet, basename='reactions')
router.register(r'comments', CommentViewSet, basename='comments')
router.register(r'reports', ReportViewSet, basename='reports')
router.register(r'tags', TagViewSet, basename='tags')
router.register(r'ingredients', IngredientViewSet, basename='ingredients')
router.register(r'users', UserViewSet, basename='users')
router.register(r'image-upload', MediaUploadViewSet, basename='image-upload')

router.register(r'current-user/search', CurrentUserSearchViewSet, basename='current-user-search')
router.register(r'current-user/recipes', UserRecipesViewSet, basename='current-user-recipes')

# Tạo nested router cho comments theo từng recipe
recipes_nested_router = routers.NestedSimpleRouter(router, r'recipes', lookup='recipe')
recipes_nested_router.register(r'comments', RecipeCommentViewSet, basename='recipe-comments')

users_nested_router = routers.NestedSimpleRouter(router, r'users', lookup='user')
users_nested_router.register(r'recipes', UserRecipesViewSet, basename='user-recipe')

# recipes_router = routers.SimpleRouter()
# recipes_router.register(r'draft', RecipeDraftViewSet, basename='draft-recipes')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/', include(recipes_nested_router.urls)),
    path('api/', include(users_nested_router.urls)),
    # path('api/recipes/', include(recipes_router.urls)),
    # path('recipes/create/', RecipeAPIView.as_view(), name='recipe'),
    # path('auth/google/', GoogleLoginAPIView.as_view(), name='user'),
    # path('auth/facebook/', FacebookLoginAPIView.as_view(), name='user2'),
]