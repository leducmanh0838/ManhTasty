export const TITLE_VALIDATION_REGEX = /^[\w\s\-_\.,!?\(\)]+$/;

export const VIETNAMESE_NAME_REGEX = /^[\p{L}\p{M}\d\s\-_\.,!?\(\)]+$/u;

// \p{L}: ký tự chữ (Letter) Unicode, bao gồm cả chữ có dấu tiếng Việt.

// \p{M}: ký tự dấu (Mark), dùng để bắt các dấu đi kèm chữ (để hỗ trợ tốt hơn dấu tiếng Việt).

// \d: số 0-9.

// \s: khoảng trắng.

// \-_\.,!?\(\): các ký tự đặc biệt cho phép.

// u flag: bật chế độ Unicode cho regex.

export const FULLNAME_REGEX = /^[\p{L}\p{M}\s]+$/u;

// \p{L}: ký tự chữ Unicode (bao gồm chữ có dấu tiếng Việt)

// \p{M}: dấu kết hợp (để hỗ trợ dấu tiếng Việt)

// \s: khoảng trắng (để ngăn cách họ và tên)

// ^...$: bắt đầu và kết thúc chuỗi — toàn bộ chuỗi phải thỏa mãn

// u flag: bật hỗ trợ Unicode