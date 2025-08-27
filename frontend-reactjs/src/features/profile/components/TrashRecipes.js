import { useContext, useEffect, useRef } from "react";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import usePagination from "../../../hooks/usePagination";
import NotFoundRecipe from "../../search/pages/NotFoundRecipe";
import { AppContext } from "../../../provides/AppProvider";
import { authApis, endpoints } from "../../../configs/Apis";
import slugify from "../../../utils/string/slugify";
import { useNavigate } from "react-router-dom";
import Avatar from "../../../components/ui/Avatar";
import { getDaysLeft } from "../../../utils/myDate";
import { FaTrashAlt } from "react-icons/fa";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import { MdOutlineRestore } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { printErrors } from "../../../utils/printErrors";
import { RecipeStatus } from "../../recipes/constants/recipeStatus";


const TrashRecipes = ({ }) => {
    const { currentUser } = useContext(AppContext)
    const navigate = useNavigate();
    const loaderRef = useRef(null);
    const {
        resultData: recipes,
        setResultData: setRecipes,
        loading,
        loadMore,
        hasMore,
    } = usePagination({ endpoint: endpoints.user.recipes(currentUser.id), isLoadFirstData: true, useAuth: !!currentUser, params: { "level": "summary-type2", "status": RecipeStatus.DELETED.value } });

    useEffect(() => {
        console.info("useEffect seachPage")
        if (!loaderRef.current || !recipes || recipes.length <= 0) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    // console.log("Chạm cuối → Gọi API load thêm dữ liệu");
                    hasMore && loadMore();
                }
            },
            { threshold: 0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [recipes]);

    const handleRestore = async (recipeId) => {
        try {
            const api = await authApis();
            const res = await api.post(endpoints.recipes.restore(recipeId))
            setRecipes(prev => prev.filter(item => item.id !== recipeId));
        } catch (err) {
            printErrors(err);
        }
    }

    return (<>
        <h2 className="fw-bold mb-3">
            Thùng rác
        </h2>
        <div className="col px-3">
            {recipes && recipes.length > 0 ? recipes.map((recipe, index) => (
                <div key={index}>
                    <div className=" p-0 border-0 card mb-3 shadow-sm w-100"
                        style={{ overflow: "auto" }}
                    // onClick={() => navigate(`/recipes/${recipe.id}-${slugify(recipe.title)}`)}
                    >
                        <div className="d-flex align-items-center p-2">
                            <Avatar src={recipe.image} size={100} />
                            <div className="">
                                <div>
                                    <div className="d-flex align-items-start">
                                        <h4 className="card-title mb-1">{recipe.title}</h4>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaTrashAlt className="me-2" color="gray" /> Còn {getDaysLeft(recipe.updated_at)} ngày
                                    </div>
                                </div>
                                <div className="d-flex mt-2">
                                    <MenuItemWithIcon icon={<MdOutlineRestore />} label="Khôi phục"
                                        className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2 border"
                                        onClick={() => handleRestore(recipe.id)} />
                                    <MenuItemWithIcon icon={<FaEye />} label="Xem chi tiết"
                                        className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2 border"
                                        onClick={() => navigate(`/recipes/${recipe.id}-${slugify(recipe.title)}`)} />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            )) :
                <div className="p-3">
                    <h1 className="text-muted">Chưa có món ăn nào trong thùng rác</h1>
                </div>}
            <div ref={loaderRef} className="p-2" />
            {loading && <LoadingSpinner size='sm' text='Đang tải món ăn...' />}
        </div>
    </>)
}

export default TrashRecipes;