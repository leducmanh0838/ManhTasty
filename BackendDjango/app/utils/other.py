import re
from collections import defaultdict

def parse_nested_list(data, files=None, prefix="steps"):
    """
    Parse các field dạng: steps[0][description], steps[0][image], ...
    Trả về list[dict] theo chỉ số index.
    """
    pattern = re.compile(rf"^{re.escape(prefix)}\[(\d+)]\[(\w+)]$")
    grouped = defaultdict(dict)

    combined = dict(data)
    if files:
        combined.update(files)

    for key, value in combined.items():
        match = pattern.match(key)
        if match:
            idx, field = int(match.group(1)), match.group(2)
            grouped[idx][field] = value

    return [grouped[i] for i in sorted(grouped)]

def to_int_or_none(val):
    try:
        if val in ("", None):
            return None
        return int(val)
    except (ValueError, TypeError):
        return None

def get_client_ip(request):
    """Hàm lấy IP thật của client (kể cả qua proxy)"""
    x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
    if x_forwarded_for:
        ip = x_forwarded_for.split(",")[0].strip()
    else:
        ip = request.META.get("REMOTE_ADDR")
    return ip