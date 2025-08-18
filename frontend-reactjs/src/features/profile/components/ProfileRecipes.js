import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import usePagination from "../../../hooks/usePagination";
import Apis, { endpoints } from "../../../configs/Apis";
import RecipeCardExtend from "../../recipes/components/RecipeCardExtend";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import NotFoundRecipe from "../../search/pages/NotFoundRecipe";

const PorfileRecipes = ({ }) => {
    const { currentUser } = useContext(AppContext)
    const loaderRef = useRef(null);
    const {
        resultData: recipes,
        loading,
        loadMore,
        hasMore,
    } = usePagination({ endpoint: endpoints.user.recipes(currentUser.id), isLoadFirstData: true, useAuth: !!currentUser, params: { "level": "summary" } });

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
        <div className="col px-3">
            {recipes && recipes.length > 0 ? recipes.map((recipe, index) => (
                <div key={index}>
                    <RecipeCardExtend recipe={recipe} />
                </div>
            )) : <NotFoundRecipe />}
            <div ref={loaderRef} className="p-2" />
            {loading && <LoadingSpinner size='sm' text='Đang tải món ăn...' />}
        </div>
    </>)
}

export default PorfileRecipes;