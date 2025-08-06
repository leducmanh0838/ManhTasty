import React, { useContext, useState } from "react";
import IngredientList from "./IngredientList";
import TagLayout from "./TagLayout";
import StepLayout from "./StepLayout";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { AppContext } from "../../../provides/AppProvider";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { slugify } from "../../../utils/Common";
import LoadingSpinner from "../../layouts/Loading/LoadingSpinner";

const RecipeCreation = () => {
    const { currentUser } = useContext(AppContext);
    const navigate = useNavigate();

    const [formErrors, setFormErrors] = useState({
        title: "",
        description: "",
        ingredients: [],  // mỗi phần tử là { name: "", quantity: "" }
    });
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [mainImage, setMainImage] = useState(null);
    const [medias, setMedias] = useState([]);
    const [tags, setTags] = useState([]);
    const [ingredients, setIngredients] = useState([{ name: "", quantity: "" }]);
    const [steps, setSteps] = useState([{ description: "", image: null },]);
    const [loading, setLoading] = useState(false);

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        // setMainImage(URL.createObjectURL(file));
        setMainImage(file);
    };

    const handleMediaChange = (e) => {
        const file = e.target.files[0];
        // setMedias([...medias, URL.createObjectURL(file)]);
        setMedias([...medias, file]);
    };

    const handleRemoveMedia = (index) => {
        const newMedias = [...medias];
        newMedias.splice(index, 1); // Xoá phần tử ở vị trí index
        setMedias(newMedias);
    }

    // const handleItemChange = (setItems, items, index, field, value) => {
    //     const newItems = [...items];
    //     newItems[index][field] = value;
    //     setItems(newItems);
    // };
    // const validateForm = () => {
    //     const newErrors = {};

    //     // Title
    //     if (!title.trim()) {
    //         newErrors.title = ["Tiêu đề là bắt buộc"];
    //     }

    //     // Description
    //     if (!description.trim()) {
    //         newErrors.description = ["Mô tả là bắt buộc"];
    //     }

    //     // Main image
    //     if (!mainImage) {
    //         newErrors.mainImage = ["Ảnh chính là bắt buộc"];
    //     }

    //     // Medias
    //     if (medias.length >= 10) {
    //         newErrors.medias = ["Không được đăng quá 9 ảnh hoặc video phụ"];
    //     }

    //     // Tags
    //     if (tags.length <= 1 || tags.length >= 20) {
    //         newErrors.tags = ["Phải chọn ít nhất 2 và không quá 19 thẻ tag"];
    //     }

    //     // Ingredients
    //     if (ingredients.length <= 1 || ingredients.length >= 20) {
    //         newErrors.ingredients = ["Phải có ít nhất 2 và không quá 19 nguyên liệu"];
    //     }

    //     // Steps
    //     if (steps.length <= 1 || steps.length >= 10) {
    //         newErrors.steps = ["Phải có ít nhất 2 và không quá 9 bước nấu"];
    //     }

    //     return newErrors;
    // };

    const uploadStepsAndMedias = async (api, recipeId) => {
        try {
            // Tạo mảng các promise cho steps
            const stepPromises = steps.map((step, index) => {
                const formData = new FormData();
                formData.append("description", step.description);
                formData.append("order", index + 1);
                if (step.image instanceof File) {
                    formData.append("image", step.image);
                }

                return api.post(endpoints.recipes.steps(recipeId), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    return res.data; // thành công
                }).catch((err) => {
                    console.error("Lỗi khi upload step:", err.response?.status, err.response?.data);
                    throw new Error("Step upload failed");
                });
            });

            // Tạo mảng các promise cho medias
            const mediaPromises = medias.map((media, index) => {
                const formData = new FormData();
                formData.append("file", media);
                formData.append("order", index + 1); // ví dụ: "image", "video"

                return api.post(endpoints.recipes.medias(recipeId), formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    return res.data; // thành công
                }).catch((err) => {
                    console.error("Lỗi khi upload step:", err.response?.status, err.response?.data);
                    throw new Error("Step upload failed");
                });
            });

            // Gộp tất cả promises
            const allRequests = [...stepPromises, ...mediaPromises];

            // Chờ tất cả hoàn thành
            await Promise.all(allRequests);

            // Nếu tất cả thành công:
            console.info("Tải lên thành công tất cả bước & media!");
            // chuyển trang, hoặc cập nhật UI ở đây
        } catch (error) {
            console.error("Lỗi khi tải lên:", error);
            alert("Có lỗi xảy ra, vui lòng thử lại.");
        }
    };



    const handleSummit = async () => {
        // const validationErrors = validateForm();

        // if (Object.keys(validationErrors).length > 0) {
        //     setErrors(validationErrors); // hiển thị lỗi từng phần
        //     return;
        // }

        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để đăng món ăn!");
            return;
        }
        try {
            setLoading(true)
            // 1. Gọi API recipe
            const api = await authApis();

            const formDataRecipe = new FormData();
            formDataRecipe.append("title", title);
            formDataRecipe.append("description", description);
            formDataRecipe.append("image", mainImage); // `mainImage` là File
            formDataRecipe.append("ingredients", JSON.stringify(ingredients));
            formDataRecipe.append("tags", JSON.stringify(tags));

            const res = await api.post(endpoints.recipes.recipes, formDataRecipe, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const recipeId = res.data.recipe_id

            await uploadStepsAndMedias(api, recipeId)

            const resSubmit = await api.patch(endpoints.recipes.submit(recipeId));

            console.info(resSubmit.data)
            navigate(`/recipes/${recipeId}-${slugify(title)}`)
        } catch (err) {
            // setErrors(err.response.data);
            if (err.response) {
                // Server phản hồi với status code ngoài khoảng 2xx
                console.error("⚠️ Lỗi từ server:");
                console.error("Status:", err.response.status);
                console.error("Message:", err.response.statusText);
                console.error("Data:", err.response.data); // thường chứa lý do chi tiết
            } else if (err.request) {
                // Yêu cầu được gửi đi nhưng không nhận được phản hồi
                console.error("❌ Không nhận phản hồi từ server:", err.request);
            } else {
                // Lỗi khi cấu hình yêu cầu
                console.error("❗ Lỗi khi tạo yêu cầu:", err.message);
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-3">
            {/* <h2 className="mb-4">Tạo công thức món ăn</h2> */}
            <div className="row">
                <div className="col-6">
                    {/* Ảnh chính */}
                    <div className="mb-3">
                        <h5>Ảnh chính</h5>

                        {/* <label className="form-label">Ảnh chính</label> */}
                        <input type="file" className="form-control" onChange={handleMainImageChange} />
                        {mainImage && <img src={URL.createObjectURL(mainImage)} className="img-thumbnail mt-2" alt="Main" style={{ height: "400px" }} />}
                    </div>

                    {/* Hình ảnh & video */}
                    <div className="mb-3">
                        <h5>Hình ảnh & video</h5>
                        {/* <label className="form-label">Hình ảnh & video</label> */}
                        <input type="file" className="form-control" onChange={handleMediaChange} />
                        <div className="d-flex flex-wrap gap-2 mt-2">
                            {medias.map((media, i) => {
                                const isImage = media.type.startsWith("image/");
                                const isVideo = media.type.startsWith("video/");

                                return (
                                    <div key={i} className="position-relative d-inline-block m-2">
                                        {isImage && (
                                            <img
                                                src={URL.createObjectURL(media)}
                                                alt={`Media ${i}`}
                                                className="img-thumbnail"
                                                style={{ width: "auto", height: "100px" }}
                                            />
                                        )}

                                        {isVideo && (
                                            <video
                                                src={URL.createObjectURL(media)}
                                                controls
                                                className="img-thumbnail"
                                                style={{ width: "auto", height: "100px" }}
                                            />
                                        )}

                                        <button
                                            type="button"
                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 m-1 rounded-circle"
                                            onClick={() => handleRemoveMedia(i)}
                                            title="Xoá media"
                                            style={{
                                                width: "24px",
                                                height: "24px",
                                                lineHeight: "12px",
                                                padding: 0,
                                                fontSize: "14px",
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Các bước */}
                    <StepLayout steps={steps} setSteps={setSteps} />
                </div>
                <div className="col-6">
                    <div className="mb-3">
                        <h5>Tên món ăn</h5>
                        {/* <label className="form-label">Tên món ăn</label> */}
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Nhập tên món"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />


                    </div>

                    {/* Mô tả */}
                    <div className="mb-3">
                        <h5>Mô tả</h5>
                        {/* <label className="form-label">Mô tả</label> */}
                        <textarea
                            className="form-control"
                            placeholder="Mô tả món ăn"
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Tags */}
                    <h5>Tag</h5>
                    <TagLayout tags={tags} setTags={setTags} />

                    {/* Nguyên liệu */}
                    <IngredientList ingredients={ingredients} setIngredients={setIngredients}
                        errors={formErrors.ingredients}
                        setErrors={(newErrors) => setFormErrors(prev => ({
                            ...prev,
                            ingredients: newErrors
                        }))} />
                </div>
            </div>

            {/* Nút lưu */}

            <button className="btn btn-success" onClick={handleSummit}>
                {loading ? (<>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    Đang đăng...
                </>) : (<>
                    Lưu công thức
                </>)}
            </button>
        </div>
    );
}

export default RecipeCreation;
