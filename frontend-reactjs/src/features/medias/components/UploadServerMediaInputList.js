import { memo, useState } from "react"
import UploadMediaInputList from "./UploadMediaInputList";
import { compressImage } from "../../../utils/file/compressImage";
import { authApis, endpoints } from "../../../configs/Apis";

const UploadServerMediaInputList = ({ medias, setMedias, accept = "image/*", inputKey, size = 180, parentType, isCloudinary=false }) => {
    const [loading, setLoading] = useState(false);
    const overrideAddMedia = async (e) => {
        if (!e.target.files[0])
            return;
        try {
            setLoading(true);
            const fileCompression = await compressImage(e.target.files[0])
            const formData = new FormData();
            formData.append("file", fileCompression);
            formData.append("parent_type", parentType);
            const api = await authApis();
            const res = await api.post(endpoints.imageUpload.list, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            setMedias(prev => [...prev, {
                "src": res.data.src,
                "type": res.data.type,
            }])
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <UploadMediaInputList {...{ medias, setMedias, accept, inputKey, size, overrideAddMedia, loading, isCloudinary }} />
            {/* {loading ? <MySpinner text="Đang tải ảnh" /> : <UploadMediaInputList {...{ medias, setMedias, accept, inputKey, size, overrideAddMedia }} />} */}
        </>
    )
}

export default memo(UploadServerMediaInputList);