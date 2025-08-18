import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import { useSearchParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import RecipeCardExtend from "../../recipes/components/RecipeCardExtend";
import "./SearchPage.css"
import NotFoundRecipe from "./NotFoundRecipe";
import usePagination from "../../../hooks/usePagination";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";

const SearchPage = () => {
    const { currentUser } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword");

    const loaderRef = useRef(null);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false; // lần đầu render → bỏ qua
            return;
        }

        // Chỉ chạy effect khi keyword thay đổi sau render đầu tiên
        console.info("keyword changed:", keyword);
        console.info("page", page);
        refresh();
        console.info("recipes: ", JSON.stringify(recipes,null,2))
    }, [keyword]);

    const {
        resultData: recipes,
        loading,
        loadMore,
        hasMore,
        refresh,
        page,
        setPage
    } = usePagination({ endpoint: endpoints.recipes.search, isLoadFirstData: true, useAuth: !!currentUser, params: { "keyword": keyword } });


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

    return (
        <div className="p-3">
            <div className="col py-4 px-3">
                {recipes && recipes.length>0 ? recipes.map((recipe, index) => (
                    <div key={index}>
                        <RecipeCardExtend recipe={recipe} />
                    </div>
                )) : <NotFoundRecipe />}
                <div ref={loaderRef} className="p-2" />
                {loading && <LoadingSpinner size='sm' text='Đang tải món ăn...' />}
            </div>
        </div>
    )
}

export default SearchPage;