export const NotificationType = Object.freeze({
  REPORT_RECIPE: { value: 1, label: "Báo cáo món ăn", color:'#be1c1cff'},
  REPORT_COMMENT: { value: 2, label: "Báo cáo bình luận", color:'#be1c1cff'},
  SYSTEM: { value: 3, label: "Thông báo hệ thống", color:'#1cbe27ff'},
});

// Nếu muốn mảng để dễ .map() khi render
export const NotificationTypeList = Object.values(NotificationType);