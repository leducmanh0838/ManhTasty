import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")
django.setup()

# from whoosh.index import open_dir
#
# from app.utils.whoosh_utils.common_whoosh_utils import INDEX_DIR
#
# ix = open_dir(INDEX_DIR)
# with ix.searcher() as searcher:
#     # Duyệt tất cả documents
#     for doc in searcher.all_stored_fields():
#         print(doc)  # doc là dict chứa các trường được lưu
#
from app.models import Ingredient, TagCategory, Tag


def create_200_ingredients():
    ingredients = [
        "xúc xích", "lạp xưởng", "thịt vịt", "thịt ngan", "thịt dê", "thịt cừu", "thịt thỏ", "thịt ngỗng",
    "thịt chim bồ câu", "cá basa", "cá rô phi", "cá trắm", "cá chép", "cá kèo", "cá bống", "cá quả",
    "cá lóc", "cá đối", "cá chim", "cá đuối", "cá cơm", "cá mòi", "cá dứa", "cá hồi xông khói",
    "tôm sú", "tôm hùm", "tôm thẻ", "tôm đất", "tôm càng xanh", "mực ống", "mực lá", "mực trứng",
    "bạch tuộc", "ốc hương", "ốc móng tay", "ốc len", "sò điệp", "sò huyết", "sò lông", "nghêu",
    "cà pháo", "măng tươi", "măng khô", "măng tây", "măng le", "bầu", "bí đao", "mướp", "khổ qua",
    "su su", "rau ngót", "rau dền", "rau lang", "rau cải xanh", "rau cải ngọt", "rau cải thìa", "rau tần ô",
    "rau diếp cá", "rau sam", "rau mồng tơi", "rau đay", "củ cải trắng", "củ cải đỏ", "củ dền", "củ năng",
    "củ sắn", "củ gừng", "củ riềng", "củ nghệ", "củ hành tây", "củ hành tây tím", "củ kiệu", "củ nén",
    "trái bầu", "trái bí đỏ", "trái bí xanh", "trái khổ qua", "trái su su", "trái mướp", "trái dưa leo", "trái cà chua bi",
    "trái ớt chuông đỏ", "trái ớt chuông xanh", "trái ớt chuông vàng", "trái dứa", "trái xoài", "trái chuối", "trái táo",
    "trái lê", "trái nho", "trái mận", "trái cam", "trái quýt", "trái bưởi", "trái chanh dây", "trái dưa hấu"

    ]

    for name in ingredients:
        Ingredient.objects.get_or_create(name=name.lower())  # lưu dạng chữ thường

    print(f"Đã tạo {len(ingredients)} nguyên liệu (chữ thường).")


def create_200_tags():
    tag_data = {
        TagCategory.TYPE: [
            "món salad", "món súp", "món mì", "món bún", "món phở", "món cơm", "món cháo", "món bánh", "món cuốn",
            "món lẩu",
            "món nướng xiên", "món gỏi", "món sandwich", "món pizza", "món burger"
        ],
        TagCategory.OCCASION: [
            "picnic", "buffet", "tiệc công ty", "party gia đình", "lễ giáng sinh", "lễ phục sinh", "tết trung thu",
            "tết dương lịch", "lễ hội đường phố", "dã ngoại biển",
            "tiệc trà", "dự án học đường", "quà tặng", "ngày của mẹ", "ngày của cha"
        ],
        TagCategory.INGREDIENT: [
            "thịt vịt", "thịt cừu", "thịt dê", "cá ngừ", "cá thu", "cá trích", "ngao", "sò điệp", "hàu", "ghẹ",
            "rau muống", "rau bina", "rau xà lách", "bắp cải", "bắp ngô"
        ],
        TagCategory.DIET: [
            "thuần thực vật", "ăn chay trường", "ăn kiêng không đường", "ăn kiêng ít muối", "ăn giàu chất xơ",
            "ăn giàu omega 3", "detox", "ăn kiêng không sữa", "gluten free strict", "ăn kiêng low sodium",
            "ăn kiêng cho người tiểu đường", "pescatarian", "flexitarian", "vegetarian", "vegan high protein"
        ],
        TagCategory.METHOD: [
            "áp chảo nhanh", "xào giòn", "chiên ngập dầu", "chiên ít dầu", "nướng than hoa", "nướng điện", "nướng lò",
            "kho tiêu", "om nước dừa", "hấp cách thủy",
            "nấu chậm", "nấu áp suất", "rang muối", "rang mè", "trộn lạnh"
        ],
        TagCategory.REGION: [
            "phú quốc", "quảng ninh", "thanh hóa", "nghệ an", "quảng bình", "quảng trị", "bình định", "phú yên",
            "bình thuận", "kon tum",
            "gia lai", "đắk lắk", "lâm đồng", "vũng tàu", "long an"
        ],
        TagCategory.FLAVOR: [
            "mặn cay", "ngọt béo", "cay nồng", "chua cay", "chua mặn", "đắng ngọt", "mặn đậm đà", "cay thanh",
            "thanh ngọt", "bùi béo",
            "mặn ngọt hài hòa", "ngọt thanh", "hơi chua", "đậm đà", "cay nhẹ"
        ],
        TagCategory.OTHER: [
            "ít nguyên liệu", "không cần nấu", "món ăn nhanh", "món ăn đường phố", "món ăn vặt", "món ăn học đường",
            "món ăn healthy", "món ăn sang trọng", "món ăn gia truyền", "món ăn fusion",
            "món ăn theo mùa", "món ăn rẻ tiền", "món ăn đắt đỏ", "món ăn đặc sản", "món ăn bình dân"
        ]
    }

    # Tạo 200 tag bằng cách random từ các nhóm
    all_tags = []
    for category, tags in tag_data.items():
        for t in tags:
            all_tags.append((t.lower(), category))

    # Nếu chưa đủ 200, tạo thêm tag giả "tag_1", "tag_2", ...
    # while len(all_tags) < 200:
    #     random_cat = random.choice(list(TagCategory))
    #     all_tags.append((f"tag_{len(all_tags)+1}", random_cat))

    # Lưu vào DB
    for name, category in all_tags:
        if not Tag.objects.filter(name=name).exists():
            Tag.objects.create(name=name, tag_category=category)

    print(f"Đã tạo {len(all_tags)} tag.")


from whoosh.index import open_dir
from whoosh.query import Or, Prefix

from app.configs.whoosh_config import INDEX_DIR

ix = open_dir(INDEX_DIR)


def suggest_keywords(keyword, limit=10):
    suggestions = set()
    with ix.searcher() as searcher:
        # Tìm từ bắt đầu giống keyword trong cả 3 field
        query = Or([
            Prefix("title", keyword),
            Prefix("ingredients", keyword),
            Prefix("tags", keyword)
        ])
        results = searcher.search(query, limit=limit)

        for r in results:
            # Lấy title, ingredients, tags gợi ý
            suggestions.add(r["title"])
            suggestions.add(r["ingredients"])
            suggestions.add(r["tags"])

    # Loại bỏ None và trả về list gọn gàng
    return [s for s in suggestions if s]


# Test
from app.utils.whoosh_utils.common_whoosh_utils import search_recipes
if __name__ == "__main__":
    print(search_recipes(keyword="trứng", page=1))
    # print(suggest_keywords("gà"))