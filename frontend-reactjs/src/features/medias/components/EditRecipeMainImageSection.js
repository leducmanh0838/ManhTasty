import { memo, useState } from "react"
import UploadMediaInput from "./UploadMediaInput";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { compressImage } from "../../../utils/file/compressImage";
import MySpinner from "../../../components/ui/MySpinner";
import { handleDraftChange } from "../../recipes/utils/draft-utils";

const EditRecipeMainImageSection = ({ image, setImage, accept = "image/*", inputKey, size = 180, parentType, recipeId }) => {
    const [loading, setLoading] = useState(false);
    const overrideAddMedia = async (e) => {
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
            // setImage(res.data.src);
            handleDraftChange(setImage, "image", res.data.src, recipeId)
            // handleDraftItemListChange(image, setImage, "medias", medias.length, null, res.data, recipeId)
        } catch (err) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {loading ? <MySpinner text="Đang tải ảnh"/>: <UploadMediaInput {...{ image, setImage, accept, inputKey, size, overrideAddMedia }} isCloudinary={true}/>}
        </>
    )
}

export default memo(EditRecipeMainImageSection);