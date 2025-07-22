from io import BytesIO

import cloudinary.uploader
import requests


def upload_avatar_to_cloudinary(avatar_url):
    # Tải ảnh từ Facebook
    response = requests.get(avatar_url)
    if response.status_code == 200:
        image_data = BytesIO(response.content)

        # Upload lên Cloudinary
        result = cloudinary.uploader.upload(image_data, folder="avatars/")
        return result.get("secure_url")
    return None