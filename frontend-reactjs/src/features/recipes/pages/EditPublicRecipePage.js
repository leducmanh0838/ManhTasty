import { useEffect, useState } from "react";
import FloatingInput from "../../../components/ui/FloatingInput";
import EditStepSection from "../../steps/components/EditStepSection";
import { useNavigate, useParams } from "react-router-dom";
import { printErrors } from "../../../utils/printErrors";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import EditRecipeMediasSection from "../../medias/components/EditRecipeMediasSection";
import EditRecipeMainImageSection from "../../medias/components/EditRecipeMainImageSection";
import { handleDraftChange } from "../utils/draft-utils";
import EditIngredientSection from "../../ingredients/components/EditIngredientSection";
import EditTagSection from "../../tags/components/EditTagSection";
import SavingSpinner from "../../../components/ui/Spinner/SavingSpinner";
import { FaCheck, FaPencilAlt } from "react-icons/fa";
import slugify from "../../../utils/string/slugify";
import { validateSubmitRecipe } from "../utils/validate";
import UploadServerMediaInput from "../../medias/components/UploadServerMediaInput";
import UploadServerMediaInputList from "../../medias/components/UploadServerMediaInputList";
import { toast } from "react-toastify";

const EditPublicRecipePage = () => {
    const { idSlug } = useParams();
    const recipeId = idSlug.split("-")[0];
    const [originalRecipe, setOriginalRecipe] = useState(null);
    // const [editedRecipe, setEditedRecipe] = useState(null);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [servings, setServings] = useState('');
    const [cookingTime, setCookingTime] = useState('');
    const [image, setImage] = useState(null);
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const resRecipe = await Apis.get(endpoints.recipes.origin(recipeId));
                const recipeData = resRecipe.data;
                // setOriginalRecipe(recipeData);
                setOriginalRecipe(JSON.parse(JSON.stringify(recipeData)));

                setTitle(recipeData.title)
                setDescription(recipeData.description)
                setServings(recipeData.servings)
                setCookingTime(recipeData.cooking_time)
                setImage(recipeData.image)
                setMedias(recipeData.medias)
                setTags(recipeData.tags)
                setIngredients(recipeData.ingredients)
                setSteps(recipeData.steps)

            } catch (err) {
                printErrors(err);
            }
        }

        fetchData();
    }, [])

    const handleSaveRecipe = async () => {
        const update = {};

    //     const [title, setTitle] = useState('');
    // const [description, setDescription] = useState('');
    // const [servings, setServings] = useState('');
    // const [cookingTime, setCookingTime] = useState('');
    // const [image, setImage] = useState(null);
    // const [medias, setMedias] = useState([]);
    // const [tags, setTags] = useState([]);
    // const [ingredients, setIngredients] = useState([]);
    // const [steps, setSteps] = useState([]);

        originalRecipe.title !== title && (update["title"] = title);
        originalRecipe.description !== description && (update["description"] = description);
        originalRecipe.servings !== servings && (update["servings"] = servings);
        originalRecipe.cooking_time !== cookingTime && (update["cookingTime"] = cookingTime);
        originalRecipe.image !== image && (update["image"] = image);
        // const equal = JSON.stringify(tags) === JSON.stringify(tag2);
        JSON.stringify(originalRecipe.medias) !== JSON.stringify(medias) && (update["medias"] = medias);
        JSON.stringify(originalRecipe.tags) !== JSON.stringify(tags) && (update["tags"] = tags);
        JSON.stringify(originalRecipe.ingredients) !== JSON.stringify(ingredients) && (update["ingredients"] = ingredients);
        JSON.stringify(originalRecipe.steps) !== JSON.stringify(steps) && (update["steps"] = steps);

        console.info("update: ", JSON.stringify(update, null, 2))
        if(Object.keys(update).length === 0){
            toast.warning("Chưa chỉnh sửa?")
            return;
        }
        try {
            setLoading(true);
            const api = await authApis();
            const res = await api.patch(endpoints.recipes.detail(recipeId), update);
            toast.success("Chỉnh sửa thành công!");
            navigate(`/recipes/${recipeId}-${slugify(title)}?skip_cache=true`)
        } catch (err) {
            printErrors(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {originalRecipe ?
                <>
                    <header className="d-flex align-items-center justify-content-between p-3 shadow bg-white sticky-top mt-2 mx-2 rounded">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div>
                                {saving ? <SavingSpinner size="sm" text="Đang lưu nháp..." /> : <>
                                    <div className="text-muted">
                                        <FaPencilAlt className="me-2" color="gray" size={16} /> Chỉnh sửa
                                    </div>
                                </>}
                            </div>
                            <div>
                                {/* <button disabled={saving} className="btn btn-danger ms-2" > Xóa bản nháp</button> */}
                                <button disabled={saving} className="btn btn-primary ms-2" onClick={handleSaveRecipe} > {loading ? <>Đang lưu...</> : <>Lưu</>}</button>
                            </div>
                        </div>
                    </header>
                    <div className="container p-2">
                        <div className="row">
                            <div className="col-7">
                                <div className="mb-1">Ảnh chính</div>
                                <EditRecipeMainImageSection inputKey="main-image" size={300} isDraft={false} {...{ image, setImage, recipeId, setSaving }} parentType={"recipe"} />

                                <div className="mb-1">Ảnh và video khác</div>
                                <EditRecipeMediasSection inputKey="medias" isDraft={false} {...{ medias, setMedias, recipeId, setSaving }} accept={"image/*,video/*"} parentType={"step"} />

                                <div className="mb-1">Các bước thực hiện</div>

                                <EditStepSection isDraft={false} {...{ steps, setSteps, recipeId, setSaving }} />
                            </div>
                            <div className="col-5">
                                <FloatingInput id="title" label="Tiêu đề" value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                // onBlur={handleTitleChange}
                                />

                                <div className="py-2">
                                    <div className="mb-1">Mô tả</div>
                                    <textarea
                                        className="form-control"
                                        placeholder="Mô tả món ăn"
                                        rows={10}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    // onBlur={handleDescriptionChange}
                                    />
                                </div>

                                <FloatingInput id="cooking_time" label="Thời gian nấu (phút)"
                                    type="number" value={cookingTime}
                                    onChange={(e) => setCookingTime(e.target.value)}
                                    // onBlur={(e) => handleDraftChange(setCookingTime, "cooking_time", e.target.value, recipeId, setSaving)}
                                    className="mb-1"
                                />

                                <FloatingInput id="servings" label="Số người ăn"
                                    type="number" value={servings}
                                    onChange={(e) => setServings(e.target.value)}
                                    // onBlur={(e) => handleDraftChange(setServings, "servings", e.target.value, recipeId, setSaving)}
                                    className="mb-1"
                                />

                                <EditTagSection isDraft={false} {...{ tags, setTags, recipeId, setSaving }} />

                                <div>
                                    <div className="mb-1">Nguyên liệu</div>
                                    <EditIngredientSection isDraft={false} {...{ ingredients, setIngredients, recipeId, setSaving }} />
                                </div>

                            </div>
                        </div>
                    </div>
                </>
                : <div> không tìm thấy bản nháp</div>}


        </>
    )
}

export default EditPublicRecipePage;