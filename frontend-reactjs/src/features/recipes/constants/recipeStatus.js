export const RecipeStatus = Object.freeze({
  CREATING: { value: -1, label: "Đang tạo", color:'#949494ff' },
  DRAFT: { value: 0, label: "Nháp", color:'#949494ff' },
  PENDING: { value: 1, label: "Chờ duyệt", color:'#FFC107' },
  ACTIVE: { value: 2, label: "Phát sóng", color:'#3cdb61ff' },
  INACTIVE: { value: 3, label: "Ẩn", color:'#949494ff' },
  DELETED: { value: 4, label: "Đã xóa", color:'#d43232ff' },
  LOCKED: { value: 5, label: "Đã bị khóa", color:'#d43232ff' },
});

export const RecipeStatusList = Object.values(RecipeStatus);