from datetime import datetime, timedelta

from pymongo import MongoClient
from django.conf import settings

client = MongoClient(host=settings.MONGODB_SETTINGS['HOST'], port=settings.MONGODB_SETTINGS['PORT'])
db = client[settings.MONGODB_SETTINGS['DB_NAME']]
# collection
search_collection = db['search_collection']
recipe_drafts_collection = db['recipe_drafts']

def log_user_search_keyword(user, keyword: str):
    """
    Ghi lại từ khóa tìm kiếm của người dùng vào MongoDB.

    Nếu người dùng đã từng tìm từ khóa này:
        - Cập nhật thời gian tìm kiếm gần nhất (`searched_at`)
        - Tăng số lần tìm kiếm (`count`)

    Nếu chưa từng tìm:
        - Thêm bản ghi mới với `count = 1`

    Tham số:
        user (User): Đối tượng người dùng (phải có thuộc tính id)
        keyword (str): Từ khóa mà người dùng tìm kiếm

    """
    if user:
        now = datetime.now()
        # lọc theo keyword và user
        user_id = user.id if user.is_authenticated else 0
        filter_query = {
            "keyword": keyword,
            "user_id": str(user_id)
        }
        # cập nhật thời gian và đếm số lượt
        update_query = {
            "$set": {"last_seen": now},
            "$setOnInsert": {"first_seen": now},
            "$inc": {"count": 1}
        }
        # Nếu chưa có bản ghi thì tự động thêm mới
        search_collection.update_one(
            filter_query,
            update_query,
            upsert=True  # Nếu chưa có thì tạo mới
        )


def get_user_search_keywords(user, limit=10):
    """
    Trả về danh sách từ khóa tìm kiếm của người dùng, sắp xếp theo thời gian gần nhất.

    Tham số:
        user (User): Đối tượng người dùng
        limit (int): Số lượng keyword tối đa cần lấy (mặc định 10)

    Trả về:
        List[Dict]: Danh sách các từ khóa gồm 'keyword', 'count', 'searched_at'
    """
    if not user:
        return []

    user_id = str(user.id)

    cursor = search_collection.find(
        {"user_id": user_id}
    ).sort("last_seen", -1).limit(limit)

    return [
        {
            "keyword": doc.get("keyword"),
            "count": doc.get("count", 1),
            "last_seen": doc.get("last_seen")
        }
        for doc in cursor
    ]


def get_recent_popular_keywords(since: datetime, limit: int = 10, kw: str = None):
    match_stage = {
        "last_seen": {"$gte": since}
    }
    if kw:
        match_stage["keyword"] = {"$regex": kw, "$options": "i"}
    pipeline = [
        {
            "$match": match_stage
        },
        {
            "$group": {
                "_id": "$keyword",
                "total_count": {"$sum": "$count"},
                "unique_users": {"$addToSet": "$user_id"}
            }
        },
        {
            "$addFields": {
                "user_count": {"$size": "$unique_users"}
            }
        },
        {
            "$sort": {"total_count": -1}
        },
        {
            "$limit": limit
        },
        {
            "$project": {
                "keyword": "$_id",
                "total_count": 1,
                "user_count": 1,
                "_id": 0
            }
        }
    ]

    return list(search_collection.aggregate(pipeline))