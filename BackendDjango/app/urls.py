from django.urls import path, include
from rest_framework import routers

from app.views.reaction_view import ReactionViewSet
from app.views.recipe_view import RecipeViewSet
from app.views.user_view import LoginViewSet

router = routers.DefaultRouter()
router.register('login', LoginViewSet, basename='login')
router.register('recipes', RecipeViewSet, basename='recipes')
router.register('reactions', ReactionViewSet, basename='reactions')

urlpatterns = [
    path('api/', include(router.urls)),
    # path('recipes/create/', RecipeAPIView.as_view(), name='recipe'),
    # path('auth/google/', GoogleLoginAPIView.as_view(), name='user'),
    # path('auth/facebook/', FacebookLoginAPIView.as_view(), name='user2'),
]