from datetime import datetime

from pymongo import MongoClient
from django.conf import settings

client = MongoClient(host=settings.MONGODB_SETTINGS['HOST'], port=settings.MONGODB_SETTINGS['PORT'])
db = client[settings.MONGODB_SETTINGS['DB_NAME']]
# collection
user_search_collection = db['user_search_keywords']
popular_keywords_collection = db['popular_search_keywords']
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
        # lọc theo keyword và user
        filter_query = {
            "keyword": keyword,
            "user_id": str(user.id)
        }
        # cập nhật thời gian và đếm số lượt
        update_query = {
            "$set": {"searched_at": datetime.now()},
            "$inc": {"count": 1}
        }
        # Nếu chưa có bản ghi thì tự động thêm mới
        user_search_collection.update_one(
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

    cursor = user_search_collection.find(
        {"user_id": user_id}
    ).sort("searched_at", -1).limit(limit)

    return [
        {
            "keyword": doc.get("keyword"),
            "count": doc.get("count", 1),
            "searched_at": doc.get("searched_at")
        }
        for doc in cursor
    ]


def log_popular_keyword(keyword: str):
    """
        Ghi nhận và cập nhật từ khóa phổ biến trong hệ thống.

        - Nếu từ khóa đã tồn tại:
            + Tăng số lượt tìm kiếm (`count`)
            + Cập nhật thời điểm tìm kiếm gần nhất (`last_seen`)
        - Nếu từ khóa chưa từng tồn tại:
            + Tạo mới với `count = 1`
            + Ghi lại thời điểm xuất hiện đầu tiên (`first_seen`)

        Tham số:
            keyword (str): Từ khóa mà người dùng vừa tìm kiếm
    """
    now = datetime.now()

    filter_query = {"keyword": keyword}
    update_query = {
        "$inc": {"count": 1},
        "$set": {"last_seen": now},
        "$setOnInsert": {"first_seen": now}
    }

    popular_keywords_collection.update_one(
        filter_query,
        update_query,
        upsert=True
    )

def get_recent_popular_keywords(limit: int, since: datetime):
    """
    Truy vấn danh sách từ khóa phổ biến và gần đây nhất.

    Điều kiện:
        - last_seen >= since
    Sắp xếp:
        - Giảm dần theo last_seen (mới nhất trước)

    Tham số:
        limit (int): Số lượng từ khóa muốn lấy
        since (datetime): Mốc thời gian lọc từ khóa
        collection (Collection): Collection MongoDB cần truy vấn

    Trả về:
        List[dict]: Danh sách từ khóa kèm thông tin count và thời gian
    """

    cursor = popular_keywords_collection.find(
        {"last_seen": {"$gte": since}}
    ).sort("count", -1).limit(limit)

    return [
        {
            "keyword": doc.get("keyword"),
            "count": doc.get("count", 1),
            "first_seen": doc.get("first_seen"),
            "last_seen": doc.get("last_seen"),
        }
        for doc in cursor
    ]

# print(get_recent_popular_keywords(10,datetime.now()))