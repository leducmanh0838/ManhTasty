from datetime import datetime

from app.configs.ai21_config import ai21_client
from app.configs.cohere_config import cohere_client
from app.configs.mongo_db_config import chatbot_history
from ai21.models.chat import ChatMessage as Ai21ChatMessage


def add_message_to_chatbot_history(user_id, sender, text, service_type=None):
    """
    Thêm một message vào hội thoại trong MongoDB.
    Nếu chưa có hội thoại -> tạo mới.
    """

    message = {
        "sender": sender,
        "text": text,
        "timestamp": datetime.now().isoformat(),
    }
    if service_type:
        message["service_type"] = service_type

    # Tìm hội thoại
    conversation = chatbot_history.find_one({
        "user_id": user_id,
        # "session_id": session_id
    })

    if conversation:
        # Thêm message vào hội thoại có sẵn
        chatbot_history.update_one(
            {"_id": conversation["_id"]},
            {"$push": {"messages": message}}
        )
    else:
        # Tạo hội thoại mới
        new_conversation = {
            "user_id": user_id,
            # "bot_id": bot_id,
            # "session_id": session_id,
            "messages": [message]
        }
        (chatbot_history
         .insert_one(new_conversation))

    return message


def get_recent_messages(user_id, limit=30):
    """
    Lấy ra danh sách message gần nhất (default 30).
    """
    conversation = chatbot_history.find_one(
        {"user_id": user_id},
        {"messages": {"$slice": -limit}}  # Lấy N phần tử cuối cùng
    )
    if conversation and "messages" in conversation:
        return conversation["messages"]
    return []


def chat_with_cohere(message: str):
    response = cohere_client.generate(
        prompt=f"""
        Bạn là chatbot chia sẻ công thức nấu ăn cho người Việt Nam và trả lời bằng Tiếng Việt
        Luôn trả lời **ngắn gọn, thân thiện**, trả lời không được quá 300 từ, và **chỉ tập trung vào món ăn mà người dùng hỏi**.
        Không viết linh tinh.

        Người dùng: {message}
        Chatbot:
        """,
        temperature=0.3,
    )
    return {
        "service_type": "cohere",
        "reply": response.generations[0].text.strip()
    }


def chat_with_ai21(message: str):
    system = "Bạn là chatbot chia sẻ công thức nấu ăn cho người Việt Nam. Luôn trả lời **ngắn gọn, thân thiện**, trả lời không được quá 300 từ"
    messages = [
        Ai21ChatMessage(content=system, role="system"),
        Ai21ChatMessage(content=message, role="user"),
    ]

    chat_completions = ai21_client.chat.completions.create(
        messages=messages,
        model="jamba-mini",
        temperature=0.3,
    )
    # for choice in chat_completions.choices:
    #     print(choice.message.content)
    reply = chat_completions.choices[0].message.content.strip()

    return {
        "service_type": "ai21",
        "reply": reply
    }


def chat_with_chatbot(message: str):
    try:
        return chat_with_ai21(message)  # Ưu tiên Cohere
    except Exception as e:
        print("⚠️ AI21 lỗi:", e)
        try:
            return chat_with_cohere(message)  # fallback AI21
        except Exception as e2:
            print("⚠️ AI21 cũng lỗi:", e2)
            return {
                "service_type": "bot",
                "reply": "Xin lỗi, hiện tại chatbot không khả dụng. Vui lòng thử lại sau."
            }
