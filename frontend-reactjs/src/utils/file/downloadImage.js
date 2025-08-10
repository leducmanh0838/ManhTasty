import slugify from "../string/slugify";


const downloadImage = async (src, fileName = "download") => {
    try {
        const response = await fetch(src);
        if (!response.ok) throw new Error("Failed to fetch image");

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;

        // Đảm bảo tên file hợp lệ + có đuôi
        // const extension = blob.type.split("/")[1] || "png";
        link.download = slugify(fileName);

        document.body.appendChild(link); // Safari cần append để click hoạt động
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // Dọn bộ nhớ
    } catch (error) {
        console.error("Download failed:", error);
    }
};

export default downloadImage;