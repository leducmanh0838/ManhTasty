from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from app.configs.cohere_config import cohere_client
from app.utils.mongo_db_utils.chatbot_utils import add_message_to_chatbot_history, chat_with_chatbot, \
    get_recent_messages


class ChatbotViewSet(viewsets.GenericViewSet):
    permission_classes = [IsAuthenticated]

    @action(methods=['post'], url_path='chat', detail=False)
    def chat(self, request):
        user_message = request.data.get("message")
        if not user_message:
            return Response({"error": "Bạn phải gửi message"}, status=400)

        add_message_to_chatbot_history(request.user.id, "user", user_message)

        # Gọi Cohere generate
        result_reply = chat_with_chatbot(user_message)

        add_message_to_chatbot_history(request.user.id, "bot", result_reply["reply"], result_reply["service_type"])

        return Response({"reply": result_reply["reply"]})

    @action(methods=['get'], url_path='chat-history', detail=False)
    def get_chat_history(self, request):
        return Response(get_recent_messages(request.user.id))
