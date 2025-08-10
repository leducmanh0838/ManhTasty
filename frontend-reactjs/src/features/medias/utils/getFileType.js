import { MediaType } from "../constants/mediaType";

export function getFileType(file) {
  if (!file || !file.type) return null;

  const type = file.type.toLowerCase();

  if (type === "image/gif") {
    return MediaType.GIF.value;
  }
  if (type.startsWith("image/")) {
    return MediaType.IMAGE.value;
  }
  if (type.startsWith("video/")) {
    return MediaType.VIDEO.value;
  }
  return null;
}
