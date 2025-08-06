# serializers.py
from rest_framework import serializers
from app.models import Tag, TagCategory

class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = ['id', 'name']