export const MediaType = Object.freeze({
  IMAGE: { value: 1, label: "Ảnh"},
  GIF: { value: 2, label: "Gif"},
  VIDEO: { value: 3, label: "Video"},
});

// Nếu muốn mảng để dễ .map() khi render
export const MediaTypeList = Object.values(MediaType);