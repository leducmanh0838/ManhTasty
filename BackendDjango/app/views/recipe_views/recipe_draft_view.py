import json

from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.parsers import JSONParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bson import ObjectId, json_util
from datetime import datetime

from app.configs.mongo_db_config import recipe_drafts_collection
from app.serializers.recipe_serializers.recipe_draft_serializers import CreateRecipeFromDraftSerializer

ALLOWED_FIELDS = {"title", "description", "image", "medias", "tags", "ingredients", "steps"}

class RecipeDraftViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]
    parser_classes = [JSONParser]

    def get_user_id(self):
        return self.request.user.id

    # def get_draft_or_404(self, draft_id):
    #     draft = recipe_drafts_collection.find_one({
    #         "_id": ObjectId(draft_id),
    #         "user_id": self.get_user_id()
    #     })
    #     if not draft:
    #         raise Response({"detail": "Draft not found"}, status=status.HTTP_404_NOT_FOUND)
    #     return draft

    # POST /recipes/draft/
    def create(self, request):
        user_id = self.get_user_id()
        now = datetime.now()

        data = {
            "user_id": user_id,
            "title": "",
            "description": "",
            "servings": "",
            "cooking_time": "",
            "image": None,
            # "cover_image": None,
            "medias": [],
            "tags": [],
            "ingredients": [{"name": "", "quantity": ""}],
            "steps": [{"description": "", "image": ""}],
            "created_at": now,
            "updated_at": now,
        }

        result = recipe_drafts_collection.insert_one(data)
        return Response({"_id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)


    def retrieve(self, request, pk):
        user_id = self.get_user_id()
        draft = recipe_drafts_collection.find_one(
            {
                "_id": ObjectId(pk),
                "user_id": user_id
            }
        )
        if not draft:
            return Response({"detail": "Draft not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(json.loads(json_util.dumps(draft)), status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None):
        user_id = self.get_user_id()
        data = request.data
        update_query = {}
        now = datetime.now()

        # Hỗ trợ $set / $push / $pull
        if "$push" in data:
            update_query["$push"] = data["$push"]

        if "$pull" in data:
            update_query["$pull"] = data["$pull"]

        if "$set" in data:
            update_query["$set"] = data["$set"]
        elif not update_query:
            # Nếu không có $push/$pull/$set thì mặc định dùng $set toàn bộ
            update_query["$set"] = data

        # Luôn cập nhật thời gian cập nhật
        update_query.setdefault("$set", {})["updated_at"] = now

        result = recipe_drafts_collection.update_one(
            {"_id": ObjectId(pk), "user_id": user_id},
            update_query
        )

        if result.matched_count == 0:
            return Response({"detail": "Draft not found"}, status=status.HTTP_404_NOT_FOUND)

        return Response({"message": "Draft updated"}, status=status.HTTP_200_OK)

    def destroy(self, request, pk):
        user_id = request.user.id  # hoặc request.user._id nếu bạn map user trong Mongo
        try:
            result = recipe_drafts_collection.delete_one({
                "_id": ObjectId(pk),
                "user_id": user_id
            })

            if result.deleted_count == 0:
                return Response({"detail": "Draft not found or not owned by user."}, status=status.HTTP_404_NOT_FOUND)

            return Response(status=status.HTTP_204_NO_CONTENT)

        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='lastest')
    def get_latest_draft(self, request):
        user_id = self.get_user_id()
        draft = recipe_drafts_collection.find_one(
            {'user_id': user_id},
            sort=[('updated_at', -1)]
        )
        if not draft:
            # return jsonify({'message': 'No draft found'}), 404
            return Response({"_id": None}, status=status.HTTP_200_OK)
        # return Response(json.loads(json_util.dumps(draft)), status=status.HTTP_200_OK)
        return Response({"_id": str(draft['_id'])}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['post'], url_path='submit')
    def submit(self, request, pk):
        serializer = CreateRecipeFromDraftSerializer(
            data=request.data, context={
                "request": request,
                "draft_id": pk
            })
        if serializer.is_valid():
            recipe = serializer.save()
            return Response({"message": "Tạo recipe thành công", "id": recipe.id, "title": recipe.title}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)