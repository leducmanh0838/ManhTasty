export const isFileAccepted = (file, accept) => {
    if (!file || !accept) return false;

    // Tách chuỗi accept thành mảng, loại bỏ khoảng trắng
    const acceptList = accept.split(',').map(type => type.trim().toLowerCase());

    // Kiểm tra file.type có match với bất kỳ phần tử nào trong acceptList
    return acceptList.some(type => {
        if (type.endsWith('/*')) {
            // Ví dụ type = "image/*", check file.type có bắt đầu "image/"
            const prefix = type.replace('/*', '');
            return file.type.toLowerCase().startsWith(prefix + '/');
        } else {
            // Ví dụ type = "image/png", so sánh chính xác
            return file.type.toLowerCase() === type;
        }
    });
}