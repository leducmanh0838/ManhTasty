from datetime import datetime, timedelta

from app.configs.mongo_db_config import view_collection
from app.configs.rules import RecipeViewRule


def add_or_update_view(recipe_id, ip_address,count=1):
    now = datetime.now()

    query = {"recipe_id": recipe_id, "ip_address": ip_address}
    # if user_id:
    #     query["user_id"] = user_id

    existing = view_collection.find_one(query)

    if existing:
        # Nếu có bản ghi trước đó, kiểm tra last_seen
        last_seen = existing.get("last_seen")
        if last_seen and now - last_seen < timedelta(minutes=RecipeViewRule.RECIPE_VIEW_COOLDOWN):
            # Không tăng count, chỉ update last_seen
            view_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"last_seen": now}}
            )
            return existing["count"]

        else:
            # Tăng count và update last_seen
            new_count = existing["count"] + count
            view_collection.update_one(
                {"_id": existing["_id"]},
                {"$set": {"last_seen": now}, "$inc": {"count": count}}
            )
            return new_count

    else:
        result = view_collection.update_one(
            query,
            {
                "$setOnInsert": {
                    "count": count,
                    "first_seen": now
                },
                "$set": {"last_seen": now}
            },
            upsert=True
        )
        return count

def get_total_views(recipe_id):
    pipeline = [
        {"$match": {"recipe_id": recipe_id}},
        {"$group": {"_id": None, "total": {"$sum": "$count"}}}
    ]
    result = list(view_collection.aggregate(pipeline))
    if result:
        return result[0]["total"]
    return 0