export const EmotionType = Object.freeze({
  LIKE: { value: 1, label: "Thích", icon: '👍' },
  LOVE: { value: 2, label: "Yêu thích", icon: '❤️' },
  HAHA: { value: 3, label: "Haha", icon: '😂' },
  WOW: { value: 4, label: "Wow", icon: '😮' },
  DELICIOUS: { value: 5, label: "Ngon", icon: '😋' },
  ANGRY: { value: 6, label: "Phẫn nộ", icon: '😡' }
});

// Nếu muốn mảng để dễ .map() khi render
export const EmotionTypeList = Object.values(EmotionType);