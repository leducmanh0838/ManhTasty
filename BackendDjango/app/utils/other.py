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


