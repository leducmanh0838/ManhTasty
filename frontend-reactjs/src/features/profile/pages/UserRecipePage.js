import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import Avatar from "../../../components/ui/Avatar"
import Apis, { endpoints } from "../../../configs/Apis";
import usePagination from "../../../hooks/usePagination";
import RecipeCardExtend from "../../recipes/components/RecipeCardExtend";
import NotFoundRecipe from "../../search/pages/NotFoundRecipe";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import { useParams } from "react-router-dom";

const UserRecipePage = ({ }) => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const { currentUser } = useContext(AppContext)
    const loaderRef = useRef(null);
    const {
        resultData: recipes,
        setResultData: setRecipes,
        loading,
        loadMore,
        refresh,
        hasMore,
        page,
        count,
    } = usePagination({ endpoint: endpoints.user.recipes(userId), isLoadFirstData: true, useAuth: !!currentUser, params: { "level": "summary" } });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Apis.get(endpoints.user.detail(userId));
                setUser(res.data)
            } catch (err) {

            }
        }
        fetchData();
    }, [])

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

    return (<>
        <div className="container p-3">
            <div className="row">
                <div className="col-3 d-flex flex-column align-items-center p-3">
                    {user && <>
                        <Avatar size={200} src={user.avatar} />
                        <div>
                            <h4 className="my-3">
                                {`${user.last_name} ${user.first_name}`}
                            </h4>
                            <p>
                                {count} món ăn được đăng
                            </p>
                        </div>
                    </>}
                </div>
                <div className="col-9 d-flex flex-column p-3">
                    <div>
                        <div className="col px-3">
                            {recipes && recipes.length > 0 ? recipes.map((recipe, index) => (
                                <div key={index}>
                                    <RecipeCardExtend recipe={recipe} />
                                </div>
                            )) : <NotFoundRecipe />}
                            <div ref={loaderRef} className="p-2" />
                            {loading && <LoadingSpinner size='sm' text='Đang tải món ăn...' />}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </>)
}

export default UserRecipePage;