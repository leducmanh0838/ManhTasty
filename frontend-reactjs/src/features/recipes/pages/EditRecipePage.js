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
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import { FaCheck } from "react-icons/fa";
import slugify from "../../../utils/string/slugify";
import { validateSubmitRecipe } from "../utils/validate";

const EditRecipePage = () => {
    const { recipeId } = useParams();
    const navigate = useNavigate();
    const [recipeExist, setRecipeExist] = useState(false);

    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(false);
    // recipe
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    // useEffect(() => {
    //     console.info("ingredients: ", JSON.stringify(ingredients, null, 2))
    // }, [ingredients])

    // useEffect(() => {
    //     console.info("tags: ", JSON.stringify(tags, null, 2))
    // }, [tags])
    // useEffect(() => {
    //     console.info("steps: ", JSON.stringify(steps, null, 2))
    // }, [steps])
    // useEffect(() => {
    //     console.info("mainImage: ", image)
    // }, [image])

    const handleTitleChange = (e) => {
        handleDraftChange(setTitle, "title", e.target.value, recipeId, setSaving)
        // setTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        handleDraftChange(setDescription, "description", e.target.value, recipeId, setSaving)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = await authApis();
                const res = await api.get(endpoints.recipes.draft.detail(recipeId));
                setRecipeExist(true)
                setTitle(res.data.title)
                setDescription(res.data.description)
                setImage(res.data.image)
                setMedias(res.data.medias)
                setSteps(res.data.steps)
                setTags(res.data.tags)
                setIngredients(res.data.ingredients)

            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setRecipeExist(false);
                } else {
                    printErrors(err);
                }
            }
        }

        fetchData();
    }, [])

    const handleSubmitRecipe = async () => {
        if (!validateSubmitRecipe(title, description, image, medias, tags, ingredients, steps)) {
            return;
        }
        try {
            setLoading(true);
            const api = await authApis();
            const res = await api.post(endpoints.recipes.draft.submit(recipeId))
            navigate(`/recipes/${res.data.id}-${slugify(res.data.title)}`);
        } catch (err) {
            printErrors(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {recipeExist ?
                <>
                    <header className="d-flex align-items-center justify-content-between p-3 shadow bg-white sticky-top mt-2 mx-2 rounded">
                        <div className="d-flex justify-content-between align-items-center w-100">
                            <div>
                                {saving ? <SavingSpinner size="sm" text="Đang lưu nháp..." /> : <>
                                    <div className="text-muted">
                                        <FaCheck className="me-2" color="gray" size={16} /> Đã lưu nháp
                                    </div>
                                </>}
                            </div>
                            <div>
                                <button disabled={saving} className="btn btn-primary" onClick={handleSubmitRecipe}> {loading ? <>Đang đăng món ăn...</> : <>Đăng món ăn</>}</button>
                            </div>
                        </div>
                    </header>
                    <div className="container p-2">
                        <div className="row">
                            <div className="col-7">
                                <div className="mb-1">Ảnh chính</div>
                                <EditRecipeMainImageSection inputKey="main-image" size={300} {...{ image, setImage, recipeId, setSaving }} parentType={"recipe"} />

                                <div className="mb-1">Ảnh và video khác</div>
                                <EditRecipeMediasSection inputKey="medias" {...{ medias, setMedias, recipeId, setSaving }} accept={"image/*,video/*"} parentType={"step"} />

                                <div className="mb-1">Các bước thực hiện</div>
                                <EditStepSection {...{ steps, setSteps, recipeId, setSaving }} />
                            </div>
                            <div className="col-5">
                                {/* <div class="form-floating mb-3">
                        <input type="email" class="form-control" id="floatingInput" placeholder="name@example.com" />
                        <label for="floatingInput">Email address</label>
                    </div> */}
                                <FloatingInput id="title" label="Tiêu đề" value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    onBlur={handleTitleChange}
                                />

                                <div className="py-2">
                                    <div className="mb-1">Mô tả</div>
                                    <textarea
                                        className="form-control"
                                        placeholder="Mô tả món ăn"
                                        rows={10}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        onBlur={handleDescriptionChange}
                                    />
                                </div>

                                <EditTagSection {...{ tags, setTags, recipeId, setSaving }} />
                                <div>
                                    <div className="mb-1">Nguyên liệu</div>
                                    <EditIngredientSection {...{ ingredients, setIngredients, recipeId, setSaving }} />
                                </div>

                            </div>
                        </div>
                    </div>
                </>
                : <div> không tìm thấy bản nháp</div>}


        </>
    )
}

export default EditRecipePage;