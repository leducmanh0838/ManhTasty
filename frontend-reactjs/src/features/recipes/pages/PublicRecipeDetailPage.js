import { useContext, useEffect, useRef, useState } from "react";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import RecipeGallery from "../components/RecipeGallery";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppContext } from "../../../provides/AppProvider";
import { MediaType } from "../../medias/constants/mediaType";
import Avatar from "../../../components/ui/Avatar"
import GridTagSimpleList from "../../tags/components/GridTagSimpleList";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner"
import GridReactionSimpleList from "../../reactions/components/GridReactionSimpleList";
import ReactionPickerButton from "../../reactions/components/ReactionPickerButton";
import { GiKnifeFork } from "react-icons/gi";
import { FaCarrot, FaInfoCircle, FaLightbulb, FaRegComment, FaStar } from "react-icons/fa";
import StepItemList from "../../steps/components/StepItemList";
import IngredientItemList from "../../ingredients/components/IngredientItemList";
import CommentSection from "../../comments/components/CommentSection";
import ReportDialogButton from "../../reports/components/ReportDialogButton";
import NameAndImageRecipeListPreview from "../components/NameAndImageRecipeListPreview";
import ConfirmDeleteDialogButton from "../../../components/Dialogs/ConfirmDeleteDialogButton"
import InfoRecommendButton from "../components/InfoRecommendButton";
import { BiTime, BiTrash } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import RecipeReviewDetailDialogButton from "../../review/components/RecipeReviewDetailDialogButton";

import RecipeReviewInputDialogButton from "../../review/components/RecipeReviewInputDialogButton";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import { PiPencil } from "react-icons/pi";
import slugify from "../../../utils/string/slugify";
import RecipeStatusUI from "../../../components/ui/RecipeStatusUI";
import { RecipeStatus } from "../constants/recipeStatus";
import { printErrors } from "../../../utils/printErrors";

const PublicRecipeDetailPage = () => {
    const [searchParams] = useSearchParams();

    const { idSlug } = useParams();
    const recipeId = idSlug.split("-")[0];
    const nav = useNavigate();

    const { currentUser } = useContext(AppContext);

    const [recipe, setRecipe] = useState(null);
    const [emotions, setEmotions] = useState({});
    const [selectedEmotion, setSelectedEmotion] = useState({});
    const [showComments, setShowComments] = useState(false);

    const [recipeRecommends, setRecipeRecommends] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOwner, setIsOwner] = useState(false);

    const loaderRef = useRef(null);

    useEffect(() => {
        if (!loaderRef.current || !recipe || loading) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    console.log("Chạm cuối → Gọi API load thêm dữ liệu");
                    setShowComments(true);
                }
            },
            { threshold: 0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [recipe, loading]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setShowComments(false);
                const queryString = searchParams.toString();
                // `/api/recipes?${queryString}`
                setLoading(true)
                // 1. Gọi API recipe
                const api = currentUser ? await authApis() : Apis;
                const resRecipe = await api.get(`${endpoints.recipes.detail(recipeId)}?${queryString}`);
                setRecipe(resRecipe.data);
                currentUser && resRecipe.data?.author?.id === currentUser.id && setIsOwner(true)
                // console.info("resRecipe.data: ", JSON.stringify(resRecipe.data, null, 2))

                // 2. Gọi API emotion counts
                const resEmotions = await Apis.get(endpoints.recipes.reactions.emotionCounts(recipeId));
                setEmotions(resEmotions.data);

                // 3. Nếu có user, gọi API riêng có token
                if (currentUser) {
                    const resCurrentEmotion = await api.get(endpoints.recipes.reactions.currentEmotion(recipeId));
                    setSelectedEmotion(resCurrentEmotion.data);
                }

                // 4. Gọi sản phẩm gợi ý
                const resRecommend = await Apis.get(endpoints.recipes.recommend(recipeId));
                setRecipeRecommends(resRecommend.data);

                // 5. Tăng lượt xem
                const resView = await Apis.post(endpoints.recipes.views(recipeId));
            } catch (err) {
                console.error("Lỗi khi load dữ liệu:", err);
            } finally {
                setLoading(false)
            }
        };

        fetchData();
    }, [recipeId]);

    const handleMoveToTrash = async () => {
        try{
            const api = await authApis();
            const res = await api.post(endpoints.recipes.trash(recipeId));
            nav("/profile/recipes")
        }catch(err){
            printErrors(err);
        }
    }

    return (
        <>
            {!loading && recipe ? <>
                <div className="container mt-2">
                    <div className="row">
                        <div className="col-12">
                            <h2
                                className="fw-bold"
                            //   style={{ fontFamily: "'Lobster', cursive", fontSize: '2rem' }}
                            >
                                {recipe?.title}
                            </h2>
                            {recipe.status !== RecipeStatus.ACTIVE.value &&
                                <div>
                                    <RecipeStatusUI recipeStatusNumber={recipe.status} />
                                </div>
                            }

                            <div className="d-flex py-3 cursor-pointer" onClick={() => recipe?.author && nav(`/users/${recipe.author.id}/recipes`)}>
                                <Avatar src={recipe?.author.avatar} size={40} />
                                <div>
                                    <div className="fw-bold">{`${recipe?.author.last_name} ${recipe?.author.first_name}`}</div>
                                    <div className="text-muted small">Được đăng bởi</div>
                                </div>
                            </div>
                            <div className="mt-1">{recipe?.description}</div>

                            {recipe && <GridTagSimpleList tags={recipe.tags} />}

                            <div className="d-flex align-items-center mb-2">
                                <div className="ms-3">
                                    <div><IoEyeSharp /> {recipe.view_count} lượt xem</div>
                                </div>
                                <div className="ms-3">
                                    <RecipeReviewDetailDialogButton recipeId={recipeId} avgStar={recipe.rating_count ? (recipe.rating_sum / recipe.rating_count).toFixed(1) : null} />
                                </div>
                            </div>

                            <div className="d-flex align-items-center">
                                <GridReactionSimpleList emotions={emotions} />
                            </div>

                            <div className="d-flex flex-row align-items-center p-1 mt-2">
                                <ReactionPickerButton {...{ emotions, setEmotions, selectedEmotion, setSelectedEmotion, objectId: recipeId, contentType: "recipe" }} />
                                {isOwner ? <>
                                    {recipe.status === RecipeStatus.ACTIVE.value && <>
                                        <div className="btn btn-light d-flex align-items-center btn-sm text-start rounded-pill gap-1 px-3 py-1 me-2 border" onClick={() => nav(`/recipes/${recipeId}-${slugify(recipe.title)}/edit`)}>
                                            <MenuItemWithIcon icon={<PiPencil size={18} />} label="Chỉnh sửa" />
                                        </div>
                                        {/* <div className="btn btn-light d-flex align-items-center btn-sm text-start rounded-pill gap-1 px-3 py-1 me-2 border" onClick={handleMoveToTrash}>
                                            <MenuItemWithIcon icon={<BiTrash size={18} />} label="Chuyển vào thùng rác" />
                                        </div> */}
                                        <ConfirmDeleteDialogButton handleDelete={handleMoveToTrash}
                                            message={"Các mục trong thùng rác sẽ tự động bị xóa sau 30 ngày. Bạn có thể khôi phục bằng cách đi đến phần Cài đặt trong Hồ sơ cá nhân."}
                                            confirmText={"Chuyển"}
                                        >

                                            <div className="btn btn-light d-flex align-items-center btn-sm text-start rounded-pill gap-1 px-3 py-1 me-2 border">
                                                <MenuItemWithIcon icon={<BiTrash size={18} />} label="Chuyển vào thùng rác" />
                                            </div>
                                        </ConfirmDeleteDialogButton>
                                    </>
                                    }

                                </> : <>
                                    <ReportDialogButton objectId={recipeId} contentType={"recipe"} className={"rounded-pill gap-1 px-3 py-1 me-2 border"} />
                                    <RecipeReviewInputDialogButton recipeId={recipeId} className={"rounded-pill gap-1 px-3 py-1 me-2 border"} />
                                </>}
                            </div>

                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            {recipe && <RecipeGallery medias={[...recipe.medias, { type: MediaType.IMAGE.value, src: recipe.image }]} />}
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-8">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                                <GiKnifeFork className="me-2" />
                                Hướng dẫn cách làm
                            </h5>
                            {recipe.cooking_time && <div className="mb-3"><BiTime /> {recipe.cooking_time} phút</div>}
                            <StepItemList steps={recipe.steps} />
                        </div>
                        <div className="col-4">
                            <h5 className="fw-bold mb-3 border-bottom pb-2">
                                <FaCarrot className="me-2" />
                                Nguyên liệu
                            </h5>
                            {recipe.servings && <div className="mb-3"><BsPeople /> {recipe.servings} người</div>}
                            <IngredientItemList ingredients={recipe.ingredients} />
                        </div>
                    </div>
                </div>
                {/* <div className="bg-dark" ref={loaderRef} style={{ height: "20px" }}></div> */}
                <div className="container">
                    <div className="row">
                        <div className="col-12 d-flex flex-column ">
                            <h5 className="fw-bold mb-3 border-top p-2 justify-content-center align-items-center">
                                <FaLightbulb className="me-2" />
                                Gợi ý sản phẩm
                                <InfoRecommendButton recipeRecommends={recipeRecommends} />
                            </h5>
                            <NameAndImageRecipeListPreview height={180} visibleRecipes={recipeRecommends} />
                        </div>
                    </div>
                </div>
            </> : <LoadingSpinner text="Đang tải món ăn..." />}

            <div ref={loaderRef} className="mt-2 p-2">
                <h5 className="fw-bold mb-3 border-top p-2">
                    <FaRegComment className="me-2" />
                    Bình luận
                </h5>
                {showComments && <CommentSection recipeId={recipeId} />}
            </div>
        </>
    )
}

export default PublicRecipeDetailPage;