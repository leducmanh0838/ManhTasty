import { memo, useState } from "react"
import UploadMediaInputList from "./UploadMediaInputList";
import { compressImage } from "../../../utils/file/compressImage";
import { authApis, endpoints } from "../../../configs/Apis";
import { handleDraftItemListChange, handleItemListChange, handleRemoveDraftItem, handleRemoveItem } from "../../recipes/utils/draft-utils";

const EditRecipeMediasSection = ({ medias, setMedias, accept = "image/*", inputKey, size = 180, parentType, recipeId, setSaving, isDraft = true }) => {
    const [loading, setLoading] = useState(false);
    // const [tempMedias, setTempMedias] = useState(false);

    const overrideDeleteMedia = async (index, value) => {
        // handleRemoveDraftItem(setMedias, "medias", index, "src", value, recipeId, setSaving)
        isDraft ? handleRemoveDraftItem(setMedias, "medias", index, "src", value, recipeId, setSaving):
        handleRemoveItem(index, setMedias)
    }

    const overrideAddMedia = async (e) => {
        if (!e.target.files[0])
            return;
        try {
            setSaving(true);
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

            // handleDraftItemListChange(medias, setMedias, "medias", medias.length, null, res.data, recipeId, setSaving)
            isDraft ? handleDraftItemListChange(medias, setMedias, "medias", medias.length, null, res.data, recipeId, setSaving) :
            handleItemListChange(medias, setMedias, medias.length, null, res.data);
        } catch (err) {

        } finally {
            setLoading(false);
            setSaving(false);
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