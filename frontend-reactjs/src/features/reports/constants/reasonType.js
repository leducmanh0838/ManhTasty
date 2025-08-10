export const ReasonType = Object.freeze({
    SPAM: { value: 1, label: "Spam", sub: "Bài đăng bị lặp, không có nội dung, chứa liên kết quảng cáo" },
    UNSUITABLE: { value: 2, label: "Nội dung không phù hợp", sub: "Công thức không liên quan, sai chủ đề (ví dụ: quảng cáo, video không liên quan nấu ăn)" },
    INACCURATE: { value: 3, label: "Nội dung giả mạo / sai sự thật", sub: "Món ăn sai nguyên liệu, công thức gây hiểu nhầm, có thể gây hại nếu làm theo" },
    OTHER: { value: 4, label: "Khác", sub: "Không thuộc trường hợp trên" },
});

// Nếu muốn mảng để dễ .map() khi render
export const ReasonTypeList = Object.values(ReasonType);