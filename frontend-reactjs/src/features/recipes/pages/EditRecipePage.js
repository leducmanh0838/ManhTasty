import { useEffect, useState } from "react";
import UploadMediaInput from "../../medias/components/UploadMediaInput";
import FloatingInput from "../../../components/ui/FloatingInput";
import UploadMediaInputList from "../../medias/components/UploadMediaInputList";
import EditStepSection from "../../steps/components/EditStepSection";
import UploadServerMediaInput from "../../medias/components/UploadServerMediaInput";
import UploadServerMediaInputList from "../../medias/components/UploadServerMediaInputList";
import { useParams } from "react-router-dom";
import { printErrors } from "../../../utils/printErrors";
import { authApis, endpoints } from "../../../configs/Apis";
import EditRecipeMediasSection from "../../medias/components/EditRecipeMediasSection";
import EditRecipeMainImageSection from "../../medias/components/EditRecipeMainImageSection";
import { handleDraftChange } from "../utils/draft-utils";
import EditIngredientSection from "../../ingredients/components/EditIngredientSection";
import EditTagSection from "../../tags/components/EditTagSection";

const EditRecipePage = () => {
    const { recipeId } = useParams();
    // recipe
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [ingredients, setIngredients] = useState([]);
    const [steps, setSteps] = useState([]);

    useEffect(() =>{
        console.info("ingredients: ", JSON.stringify(ingredients,null,2))
    }, [ingredients])

    useEffect(() =>{
        console.info("tags: ", JSON.stringify(tags,null,2))
    }, [tags])

    const handleTitleChange = (e) => {
        handleDraftChange(setTitle, "title", e.target.value, recipeId)
        // setTitle(e.target.value)
    }

    const handleDescriptionChange = (e) => {
        handleDraftChange(setDescription, "description", e.target.value, recipeId)
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = await authApis();
                const res = await api.get(endpoints.recipes.draft.detail(recipeId));

                setTitle(res.data.title)
                setDescription(res.data.description)
                setImage(res.data.image)
                setMedias(res.data.medias)
                setSteps(res.data.steps)
                setTags(res.data.tags)
                setIngredients(res.data.ingredients)

            } catch (err) {
                printErrors(err);
            }
        }

        fetchData();
    }, [])

    useEffect(() => {
        console.info("steps: ", JSON.stringify(steps, null, 2))
    }, [steps])
    useEffect(() => {
        console.info("mainImage: ", image)
    }, [image])

    return (
        <>
            <div className="row">
                <div className="col-7">
                    <div className="mb-1">Ảnh chính</div>
                    <EditRecipeMainImageSection inputKey="main-image" size={300} {...{ image, setImage, recipeId }} parentType={"recipe"} />

                    <div className="mb-1">Ảnh và video khác</div>
                    <EditRecipeMediasSection inputKey="medias" {...{ medias, setMedias, recipeId }} accept={"image/*,video/*"} parentType={"step"} />

                    <EditStepSection {...{ steps, setSteps, recipeId }} />
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

                    <EditTagSection {...{ tags, setTags, recipeId }} />
                    <div>
                        <div className="mb-1">Nguyên liệu</div>
                        <EditIngredientSection {...{ ingredients, setIngredients, recipeId }} />
                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default EditRecipePage;