import CameraInputUI from "../../../components/ui/CameraInputUI";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { isFileAccepted } from "../../../utils/file/isFileAccepted";
import { getFileType } from "../utils/getFileType";
import MediaView from "./MediaView";
import { memo } from "react";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";

const UploadMediaInputList = ({ medias, setMedias, accept = "image/*", inputKey, size = 180, overrideAddMedia, overrideDeleteMedia, loading, isCloudinary=false }) => {

    const handleDeleteMedia = (index, value) => {
        if (overrideDeleteMedia) {
            overrideDeleteMedia(index, value);
            return;
        }
        setMedias(prev => prev.filter((_, i) => i !== index));
    }


    const handleAddMedia = (e) => {
        if (overrideAddMedia) {
            overrideAddMedia(e);
            return;
        }
        const file = e.target.files[0];
        if (file) {
            if (isFileAccepted(file, accept)) {
                const type = getFileType(file)
                setMedias(prev => [...prev, {
                    "src": URL.createObjectURL(file),
                    type
                }])
            } else
                toast.warning("Vui lòng thêm file hợp lệ!!");
        }
    }


    return (
        <div className="d-flex overflow-auto">
            {medias.map((media, index) =>
                <div className="position-relative">
                    {/* <img className="rounded-3 border m-1"
                        src={URL.createObjectURL(media.src)}
                        alt="Ảnh bước"
                        style={{ height: `${size}px`, objectFit: "contain" }}
                    /> */}
                    <MediaView mediaType={media.type} src={media.src} height={size} isCloudinary={isCloudinary} className="m-1 border" />
                    <button
                        className="m-1 position-absolute bg-dark bg-opacity-50 border-0 rounded-circle text-white d-flex align-items-center justify-content-center"
                        onClick={() => handleDeleteMedia(index, media.src)}
                        style={{
                            // position: "absolute",
                            bottom: 5,
                            right: 5,
                            width: 28,
                            height: 28,
                            cursor: "pointer",
                        }}
                        aria-label="Xóa ảnh"
                    >
                        <IoTrashOutline />
                    </button>
                </div>
            )}

            <div>
                <input
                    type="file"
                    accept={accept}
                    id={inputKey}
                    className="d-none"
                    // onChange={(e) => e.target.files[0] && isFileAccepted(e.target.files[0]) && setMedias(prev => [...prev, e.target.files[0]])}
                    onChange={handleAddMedia}
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
                    {loading ? <LoadingSpinner text="Đang tải ảnh lên server..." /> : <><CameraInputUI /></>}
                </label>
            </div>
        </div>
    )
}
// export default UploadMediaListInput;
export default memo(UploadMediaInputList);