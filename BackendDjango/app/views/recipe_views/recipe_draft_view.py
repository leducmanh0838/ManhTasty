from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bson import ObjectId
from datetime import datetime

from app.utils.mongodb import recipe_drafts_collection


class RecipeDraftViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    def get_user_id(self):
        return self.request.user.id

    def get_draft_or_404(self, draft_id):
        draft = recipe_drafts_collection.find_one({
            "_id": ObjectId(draft_id),
            "user_id": self.get_user_id()
        })
        if not draft:
            raise Response({"detail": "Draft not found"}, status=status.HTTP_404_NOT_FOUND)
        return draft

    # POST /recipes/draft/
    def create(self, request):
        user_id = self.get_user_id()
        now = datetime.now()

        data = {
            "user_id": user_id,
            "title": "",
            "description": "",
            "image": None,
            "cover_image": None,
            "tags": [],
            "ingredients": [],
            "steps": [],
            "created_at": now,
            "updated_at": now,
        }

        result = recipe_drafts_collection.insert_one(data)
        return Response({"_id": str(result.inserted_id)}, status=status.HTTP_201_CREATED)

    # PATCH /recipes/draft/{id}/
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
