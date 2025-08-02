from rest_framework import permissions

from app.models import RecipeStatus



class IsAuthor(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # # Nếu là các method an toàn (GET, HEAD, OPTIONS) thì luôn cho phép
        # if request.method in permissions.SAFE_METHODS:
        #     return True
        #
        # # Nếu là POST, PATCH, DELETE thì kiểm tra chủ sở hữu
        return obj.author == request.user

class CanEditRecipeStatusPermission(permissions.BasePermission):
    """
    Chỉ cho phép sửa recipe nếu status nằm trong các trạng thái cho phép.
    """

    def has_object_permission(self, request, view, obj):
        # Nếu là phương thức đọc thì luôn cho phép
        if request.method in ('GET', 'HEAD', 'OPTIONS'):
            return True

        # Các phương thức ghi (PUT, PATCH, DELETE...) sẽ bị giới hạn
        return obj.status in [
            RecipeStatus.CREATING,
            RecipeStatus.DRAFT,
            RecipeStatus.ACTIVE,
            RecipeStatus.INACTIVE,
        ]

class IsOwnerOfReaction(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # `obj` ở đây là một instance của Reaction
        return obj.user == request.user
