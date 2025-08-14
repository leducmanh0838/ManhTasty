import imageCompression from "browser-image-compression";

export async function compressImage(file, options = {}) {
  // return file;
  const defaultOptions = {
    maxSizeMB: 1,
    maxWidthOrHeight: 100,
    useWebWorker: true,
  };
  const compressOptions = { ...defaultOptions, ...options };

  try {
    const compressedFile = await imageCompression(file, compressOptions);
    return compressedFile;
  } catch (error) {
    console.error("compressImage error:", error);
    // Nếu lỗi thì trả về ảnh gốc để không làm gián đoạn luồng
    return file;
  }
}
