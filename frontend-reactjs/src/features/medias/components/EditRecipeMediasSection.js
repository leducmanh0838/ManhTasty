import { memo, useState } from "react"
import UploadMediaInputList from "./UploadMediaInputList";
import { compressImage } from "../../../utils/file/compressImage";
import { authApis, endpoints } from "../../../configs/Apis";
import { handleDraftItemListChange, handleRemoveDraftItem } from "../../recipes/utils/draft-utils";

const EditRecipeMediasSection = ({ medias, setMedias, accept = "image/*", inputKey, size = 180, parentType, recipeId }) => {
    const [loading, setLoading] = useState(false);
    // const [tempMedias, setTempMedias] = useState(false);

    const overrideDeleteMedia = async (index, value) => {
        handleRemoveDraftItem(setMedias, "medias", index, "src", value, recipeId)
    }

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
            // setTempMedias(prev => [...prev, {
            //     "src": res.data.src,
            //     "type": res.data.type,
            // }])
            handleDraftItemListChange(medias, setMedias, "medias", medias.length, null, res.data, recipeId)
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <UploadMediaInputList isCloudinary={true} {...{ medias, setMedias, accept, inputKey, size, overrideAddMedia, overrideDeleteMedia, loading }} />
            {/* {loading ? <MySpinner text="Đang tải ảnh" /> : <UploadMediaInputList {...{ medias, setMedias, accept, inputKey, size, overrideAddMedia }} />} */}
        </>
    )
}

export default memo(EditRecipeMediasSection);