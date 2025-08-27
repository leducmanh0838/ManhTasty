import { toast } from "react-toastify";
import CameraInputUI from "../../../components/ui/CameraInputUI";
import { isFileAccepted } from "../../../utils/file/isFileAccepted";
import { memo, useEffect } from "react";
import { MediaType } from "../constants/mediaType";
import { getMediaCloudinary } from "../../../utils/file/getMediaCloudinary";

const UploadMediaInput = ({ image, setImage, accept = "image/*", inputKey, size = 180, overrideAddMedia, isCloudinary = false }) => {

    const handleUploadMedia = (e) => {
        if (overrideAddMedia) {
            overrideAddMedia(e);
        } else if (e.target.files[0]) {
            const file = e.target.files[0];
            if (isFileAccepted(file, accept)) {
                // Nếu image trước đó là blob URL thì revoke nó để tránh rò rỉ bộ nhớ
                if (image && image.startsWith("blob:")) {
                    URL.revokeObjectURL(image);
                }

                const newImageUrl = URL.createObjectURL(file);
                setImage(newImageUrl);
            } else {
                toast.warning("Vui lòng thêm file hợp lệ!!");
            }
        }
    };

    useEffect(() => {
        return () => {
            if (image && image.startsWith('blob:')) {
                URL.revokeObjectURL(image); // giải phóng khi component unmount
                console.log('Blob URL revoked on unmount');
            }
        };
    }, [image]);

    return (
        <div>
            <input
                type="file"
                accept={accept}
                id={inputKey}
                className="d-none"
                onChange={handleUploadMedia}
            />

            <label
                htmlFor={inputKey}
                className="upload-box"
                style={{
                    display: "flex",
                    // justifyContent: "center",
                    // alignItems: "center",
                    // backgroundColor: "#faf8f5",
                    // border: "2px dashed #ddd",
                    // borderRadius: "12px",
                    width: `${size}px`,
                    height: `${size}px`,
                    cursor: "pointer",
                }}
            >
                {image ? (
                    <img className="rounded-3"
                        src={isCloudinary?getMediaCloudinary(image, MediaType.IMAGE.value):image}
                        alt="Ảnh chính"
                        style={{ height: `${size}px`, objectFit: "contain" }}
                    />
                ) : (
                    <CameraInputUI iconSize={60} />
                )}
            </label>
        </div>
    )
}
export default memo(UploadMediaInput);