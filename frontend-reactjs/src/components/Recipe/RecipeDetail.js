import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import RecipeGallery from "./RecipeDetailLayout/RecipeGallery";
import GridTagList from "./RecipeDetailLayout/GridTagList";
import IngredientList from "./RecipeDetailLayout/IngredientList";
import StepList from "./RecipeDetailLayout/StepList";
import { FaCarrot, FaRegComment, FaThumbsUp } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import EmotionList from "../Emotion/EmotionList";
import { HiOutlineThumbUp } from "react-icons/hi";
import { EmotionType, emotionTypes, MediaType } from "../../configs/Types";
import { AppContext } from "../../provides/AppProvider";
import CommentLayout from "./RecipeDetailLayout/Comment/CommentLayout";
import { toast } from "react-toastify";


const RecipeDetail = () => {
    const { idSlug } = useParams();
    const recipeId = idSlug.split("-")[0];

    const { currentUser } = useContext(AppContext);

    const [recipe, setRecipe] = useState(null);
    const [showEmotionMenu, setShowEmotionMenu] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState({});

    const [emotions, setEmotions] = useState({});

    //   console.info(id)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Gọi API recipe
                const resRecipe = await Apis.get(endpoints.recipes.recipeDetail(recipeId));
                setRecipe(resRecipe.data);

                // 2. Gọi API emotion counts
                const resEmotions = await Apis.get(endpoints.recipes.reactions.emotionCounts(recipeId));
                setEmotions(resEmotions.data);

                // 3. Nếu có user, gọi API riêng có token
                if (currentUser) {
                    const api = await authApis();  // chỗ này gọi API instance có token
                    const resCurrentEmotion = await api.get(endpoints.recipes.reactions.currentEmotion(recipeId));
                    // const emotionId = resMyEmotion.data.emotion;
                    setSelectedEmotion(resCurrentEmotion.data);
                    // setSelectedEmotion(emotionTypes.find(emotion => emotion.id === emotionId)); // nếu bạn có state này
                }
            } catch (err) {
                console.error("Lỗi khi load dữ liệu:", err);
            }
        };

        fetchData();
    }, []);

    if (!recipe) return <div className="text-center py-10">Đang tải công thức...</div>;

    const handleGiveEmotion = async (emotionType) => {
        console.info("handleGiveEmotion")
        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để thả cảm xúc!");
            return;
        }
        try {
            const api = await authApis();

            let response = await api.post(
                endpoints.reactions.reactions,
                {
                    object_id: recipeId,
                    content_type: "recipe",
                    emotion: emotionType
                }
            );

            if (selectedEmotion && selectedEmotion.emotion) {
                const oldEmotionType = selectedEmotion.emotion.toString();
                setEmotions(prev => ({
                    ...prev,
                    [oldEmotionType]: prev[oldEmotionType] - 1
                }));
            }

            setSelectedEmotion(response.data)

            const newEmotionType = response.data.emotion.toString();
            setEmotions(prev => ({
                ...prev,
                [newEmotionType]: prev[newEmotionType] + 1
            }));

        } catch (error) {

            // setSubmitSuccess(false);

            // if (error.response && error.response.data && error.response.data.message) {
            //     setSubmitError(error.response.data.message);
            // } else {
            //     setSubmitError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
            // }

            console.error("Login error:", error.response || error.message);
        }
    }

    const handleDeleteCurrentEmotion = async () => {
        if (!currentUser) {
            toast.warning("Bạn cần đăng nhập để thả cảm xúc!");
            return;
        }
        try {
            const api = await authApis();
            const reactionId = selectedEmotion.id

            let response = await api.delete(
                endpoints.reactions.reactionDetail(reactionId)
            );

            const oldEmotionType = selectedEmotion.emotion.toString();
            setEmotions(prev => ({
                ...prev,
                [oldEmotionType]: prev[oldEmotionType] - 1
            }));
            setSelectedEmotion({})
        } catch (error) {

            // setSubmitSuccess(false);

            // if (error.response && error.response.data && error.response.data.message) {
            //     setSubmitError(error.response.data.message);
            // } else {
            //     setSubmitError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
            // }

            console.error("Login error:", error.response || error.message);
        }
    }

    return (
        <>
            <div className="row">
                <div className="col-8">
                    <RecipeGallery medias={[...recipe.medias, { type: MediaType.IMAGE, src: recipe.image }]} />
                </div>
                <div className="col-4 py-4">
                    <h2
                        className="fw-bold"
                    //   style={{ fontFamily: "'Lobster', cursive", fontSize: '2rem' }}
                    >
                        {recipe.title}
                    </h2>
                    <div className="d-flex py-3">
                        <img
                            src={recipe.author.avatar}
                            alt="Avatar"
                            className="rounded-circle me-2"
                            width={40}
                            height={40}
                        />
                        <div>
                            <div className="fw-bold">{`${recipe.author.last_name} ${recipe.author.first_name}`}</div>
                            <div className="text-muted small">Được đăng bởi</div>
                        </div>
                    </div>
                    <div className="mt-1">{recipe.description}</div>
                    {/* <h3>Tags</h3> */}
                    <GridTagList tags={recipe.tags} />

                    <EmotionList emotions={emotions} />


                    <div
                        className="position-relative d-inline-block mt-3"
                        onMouseEnter={() => setShowEmotionMenu(true)}
                        onMouseLeave={() => setShowEmotionMenu(false)}
                    >
                        <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1">
                            {selectedEmotion && selectedEmotion.emotion ? <div onClick={handleDeleteCurrentEmotion}>
                                <span>{EmotionType.getIcon(selectedEmotion.emotion)}</span> <span>{EmotionType.getLabel(selectedEmotion.emotion)}</span>
                            </div> : <>
                                <span><HiOutlineThumbUp /></span> <span>Thích</span>
                            </>}
                        </button>

                        {showEmotionMenu && (
                            <div
                                className="position-absolute bg-white shadow-sm rounded-pill px-2 py-1 d-flex gap-2 mt-1"
                                style={{
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 10,
                                }}
                            >
                                {emotionTypes.map((e) => (
                                    <button
                                        key={e.id}
                                        className="btn btn-sm bg-white border-0 fs-4"
                                        onClick={() => {
                                            // setSelectedEmotion(e.id);
                                            setShowEmotionMenu(false);
                                            handleGiveEmotion(e.id);
                                        }}
                                        title={e.label}
                                    >
                                        {e.icon}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>


                </div>
            </div>
            <div className="row">
                <div className="col-8">
                    <h5 className="fw-bold mb-3 border-bottom pb-2">
                        <GiKnifeFork className="me-2" />
                        Hướng dẫn cách làm
                    </h5>
                    <StepList steps={recipe.steps} />
                </div>
                <div className="col-4">
                    <h5 className="fw-bold mb-3 border-bottom pb-2">
                        <FaCarrot className="me-2" />
                        Nguyên liệu
                    </h5>
                    <IngredientList ingredients={recipe.ingredients} />
                </div>
            </div>

            <div className="mt-2 p-2">
                <h5 className="fw-bold mb-3 border-top p-2">
                    <FaRegComment className="me-2" />
                    Bình luận
                </h5>
                {/* <CommentInput onSubmit={handleAddComment}/> */}
                {/* <CommentList recipeId={recipeId} /> */}
                <CommentLayout recipeId={recipeId} />
            </div>
        </>

    );
};

export default RecipeDetail;