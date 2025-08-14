from urllib.parse import urlencode

def get_pagination_links(base_url, total_pages, **params):
    links = {
        "next": None,
        "previous": None
    }

    page = int(params.get("page") or 1)

    # next page
    if page < total_pages:
        params = params.copy()
        params["page"] = page + 1
        links["next"] = f"{base_url}?{urlencode(params)}"

    # previous page
    if page > 1:
        params = params.copy()
        params["page"] = page - 1
        links["previous"] = f"{base_url}?{urlencode(params)}"

    return links