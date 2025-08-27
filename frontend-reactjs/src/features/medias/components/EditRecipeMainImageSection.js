import { memo, useState } from "react"
import UploadMediaInput from "./UploadMediaInput";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { compressImage } from "../../../utils/file/compressImage";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import { handleDraftChange } from "../../recipes/utils/draft-utils";

const EditRecipeMainImageSection = ({ image, setImage, accept = "image/*", inputKey, size = 180, parentType, recipeId, setSaving, isDraft = true }) => {
    const [loading, setLoading] = useState(false);
    const overrideAddMedia = async (e) => {
        try {
            setSaving(true)
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
            // update
            // handleDraftChange(setImage, "image", res.data.src, recipeId, setSaving)
            isDraft ? handleDraftChange(setImage, "image", res.data.src, recipeId, setSaving): setImage(res.data.src)
        } catch (err) {

        } finally {
            setSaving(false)
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <LoadingSpinner text="Đang tải ảnh" /> : <UploadMediaInput {...{ image, setImage, accept, inputKey, size, overrideAddMedia }} isCloudinary={true} />}
        </>
    )
}

export default memo(EditRecipeMainImageSection);