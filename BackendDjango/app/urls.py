from django.urls import path

from app.views import RecipeAPIView

urlpatterns = [
    path('recipes/create/', RecipeAPIView.as_view(), name='create-recipe'),
]