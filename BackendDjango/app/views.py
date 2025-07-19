from django.shortcuts import render
from rest_framework import generics, permissions

from app.models import Recipe
from app.serializers.recipe_serializers import RecipeCreateSerializer

# Create your views here.

# class RecipeCreateAPIView(generics.CreateAPIView):
#     queryset = Recipe.objects.all()
#     serializer_class = RecipeSerializer
#     permission_classes = [permissions.IsAuthenticated]
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status

class RecipeAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def post(self, request):
        serializer = RecipeCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            recipe = serializer.save()
            return Response({"message": "Recipe created successfully", "recipe_id": recipe.id}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)