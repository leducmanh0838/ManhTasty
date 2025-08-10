export async function printErrors(err) {
    // 1. Lỗi từ response trả về (thường server trả về lỗi, ví dụ 400, 500)
    if (err.response) {
        console.error('Error status:', err.response.status);       // Mã lỗi HTTP
        console.error('Error headers:', err.response.headers);     // Header trả về
        console.error('Error data:', err.response.data);           // Body lỗi (thường chứa message chi tiết)
    }
    // 2. Lỗi do request đã gửi nhưng không có response (vd: mất mạng, timeout)
    else if (err.request) {
        console.error('No response received, request:', err.request);
    }
    // 3. Lỗi khi thiết lập request (vd: cấu hình sai)
    else {
        console.error('Error message:', err.message);
    }

    // Thông tin toàn bộ lỗi (stacktrace)
    console.error('Error config:', err.config);
}
