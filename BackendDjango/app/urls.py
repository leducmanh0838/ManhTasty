from django.urls import path

from app.views import RecipeCreateAPIView

urlpatterns = [
    path('recipes/create/', RecipeCreateAPIView.as_view(), name='create-recipe'),
]