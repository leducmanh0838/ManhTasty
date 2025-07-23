from rest_framework.pagination import PageNumberPagination

class RecipePagination(PageNumberPagination):
    page_size = 10  # số item trên mỗi trang
    page_size_query_param = 'page_size'  # cho phép ?page_size=20
    max_page_size = 100