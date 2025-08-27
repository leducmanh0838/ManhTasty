from django.utils import timezone
from datetime import timedelta, date
from django.db.models.functions import TruncDay, TruncMonth, TruncQuarter, TruncYear
from django.db.models import Count

from app.models import Recipe


def get_recipe_stats(by="month", periods=None):
    """
    Thống kê số công thức theo thời gian (day, month, quarter, year).

    - by: "day" | "month" | "quarter" | "year"
    - periods: số khoảng thời gian gần nhất (ví dụ: 6 tháng, 7 ngày, 3 năm).
               Nếu None thì lấy toàn bộ.
    """
    qs = Recipe.objects.all()
    now = timezone.now()

    # Gom nhóm theo khoảng thời gian
    if by == "day":
        qs = qs.annotate(period=TruncDay("created_at"))
        if periods:
            qs = qs.filter(created_at__gte=now - timedelta(days=periods))
    elif by == "month":
        qs = qs.annotate(period=TruncMonth("created_at"))
        if periods:
            # tính ngày đầu tiên của tháng hiện tại rồi lùi "periods" tháng
            year = now.year
            month = now.month - periods + 1
            while month <= 0:  # lùi qua năm trước
                month += 12
                year -= 1
            start_date = date(year, month, 1)
            qs = qs.filter(created_at__gte=start_date)
    elif by == "quarter":
        qs = qs.annotate(period=TruncQuarter("created_at"))
        if periods:
            # lấy quý hiện tại rồi lùi periods quý
            current_quarter = (now.month - 1) // 3 + 1
            total_quarters = (now.year * 4 + current_quarter) - periods + 1
            start_year = (total_quarters - 1) // 4
            start_quarter = (total_quarters - 1) % 4 + 1
            start_month = (start_quarter - 1) * 3 + 1
            start_date = date(start_year, start_month, 1)
            qs = qs.filter(created_at__gte=start_date)
    elif by == "year":
        qs = qs.annotate(period=TruncYear("created_at"))
        if periods:
            qs = qs.filter(created_at__year__gte=now.year - periods + 1)
    else:
        raise ValueError("by phải là: day | month | quarter | year")

    return (
        qs.values("period")
          .annotate(total=Count("id"))
          .order_by("period")
    )