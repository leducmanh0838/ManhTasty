from django.shortcuts import render
from rest_framework import generics, permissions

from app.models import Recipe
from app.serializers.recipe_serializers import RecipeSerializer


# Create your views here.

class RecipeCreateAPIView(generics.CreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = [permissions.IsAuthenticated]