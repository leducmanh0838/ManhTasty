import random
from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from faker import Faker

from app.models import User, LoginType  # đổi your_app cho đúng

fake = Faker()

def create_fake_users(n: int = 100, password: str = "Admin@123"):
    # Lấy danh sách login_type hợp lệ
    try:
        # Nếu bạn dùng IntegerChoices
        login_type_values = [lt.value for lt in LoginType]
    except TypeError:
        # fallback nếu LoginType là Enum bình thường
        login_type_values = [x[0] for x in LoginType.choices]

    users = []
    for i in range(n):
        print(f'user {i}\n')
        username = fake.unique.user_name()
        email = fake.unique.email()
        avatar = f"https://i.pravatar.cc/300?img={random.randint(1, 70)}"

        users.append(User(
            username=username,
            email=email,
            password=make_password(password),
            login_type=random.choice(login_type_values),
            avatar=avatar,
        ))

    User.objects.bulk_create(users, ignore_conflicts=True)  # ignore_conflicts để tránh trùng unique
    return n

class Command(BaseCommand):
    help = "Seed random users"

    def add_arguments(self, parser):
        parser.add_argument("--n", type=int, default=100, help="Số lượng user cần tạo")
        parser.add_argument("--password", type=str, default="123456", help="Mật khẩu mặc định")

    def handle(self, *args, **options):
        n = options["n"]
        password = options["password"]
        created = create_fake_users(n, password)
        self.stdout.write(self.style.SUCCESS(f"Tạo {created} users thành công!"))
