import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import RecipeGallery from "./RecipeDetailLayout/RecipeGallery";
import GridTagList from "./RecipeDetailLayout/GridTagList";
import IngredientList from "./RecipeDetailLayout/IngredientList";
import StepList from "./RecipeDetailLayout/StepList";
import { FaCarrot, FaThumbsUp } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import EmotionList from "../Emotion/EmotionList";
import { HiOutlineThumbUp } from "react-icons/hi";
import { emotionTypes } from "../../configs/Types";

// const emotionData = [
//   { emoji: '🥰', count: 3 },
//   { emoji: '💖', count: 5 },
//   { emoji: '👏', count: 1 },
// ];

// const emotionData = [
//   { icon: <FaThumbsUp className="text-primary" />, count: 3 },
//   { icon: <AiFillHeart className="text-danger" />, count: 5 },
//   { icon: <FaHandsClapping className="text-warning" />, count: 1 },
// ];
const emotionData = {
    "1": 10,
    "2": 5,
    "3": 1,
    "4": 2,
    "5": 5,
    "6": 8
}

const RecipeDetail = () => {
    const { idSlug } = useParams();
    const recipeId = idSlug.split("-")[0];

    const [recipe, setRecipe] = useState(null);
    // const [liked, setLiked] = useState(false);
    // const [selected, setSelected] = useState(null);
    // const [showMenu, setShowMenu] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [selected, setSelected] = useState(null);
    const [emotions, setEmotions] = useState(null);

    //   console.info(id)
    useEffect(() => {
        Apis.get(endpoints.recipes.recipeDetail(recipeId))
            .then(res => setRecipe(res.data));
        Apis.get(endpoints.recipes.emotion(recipeId))
            .then(res => setEmotions(res.data));
    }, []);

    if (!recipe) return <div className="text-center py-10">Đang tải công thức...</div>;

    const handleGiveEmotion = async (emotionType) => {
        try {

            console.info(endpoints.reactions.reactions)
            
            const api = await authApis();

            let response = await api.post(
                endpoints.reactions.reactions,
                {
                    object_id: recipeId,
                    content_type: "recipe",
                    emotion: emotionType
                }
            );

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
                    <RecipeGallery medias={recipe.medias} />
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
                    {/* <button
                        // onClick={toggleLike}
                        className={`btn border-0 flex items-center space-x-2 px-4 py-2 bg-light rounded-pill my-2 shadow-sm
        ${liked ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        <HiOutlineThumbUp size={20} className={`${liked ? "text-white" : "text-gray-600"} mx-2`} />
                        <span style={{fontSize:"16px"}}>{liked ? "Đã thích" : "Thích"}</span>
                    </button> */}


                    <div
                        className="position-relative d-inline-block mt-3"
                        onMouseEnter={() => setShowMenu(true)}
                        onMouseLeave={() => setShowMenu(false)}
                    >
                        <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1">
                            {selected ? <>
                                <span>{selected.icon}</span> <span>{selected.label}</span>
                            </> : <>
                                <span><HiOutlineThumbUp /></span> <span>Thích</span>
                            </>}
                        </button>

                        {showMenu && (
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
                                            setSelected(e);
                                            setShowMenu(false);
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
        </>

    );
};

export default RecipeDetail;