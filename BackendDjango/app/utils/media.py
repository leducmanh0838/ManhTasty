from io import BytesIO

import cloudinary.uploader
import requests
import uuid
from datetime import datetime

from app.models import MediaType


def upload_avatar_to_cloudinary(avatar_url):
    # Tải ảnh từ Facebook
    response = requests.get(avatar_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)

        # Upload lên Cloudinary
        result = cloudinary.uploader.upload(image_data, folder="avatars/")
        return result.get("secure_url")
    return None

def generate_public_id():
    date_str = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_str = uuid.uuid4().hex[:8]
    return f"{date_str}_{unique_str}"

def detect_media_type(file):
    content_type = file.content_type
    if content_type.startswith("image/") and content_type != "image/gif":
        return MediaType.IMAGE
    elif content_type == "image/gif":
        return MediaType.GIF
    elif content_type.startswith("video/"):
        return MediaType.VIDEO
    return -1