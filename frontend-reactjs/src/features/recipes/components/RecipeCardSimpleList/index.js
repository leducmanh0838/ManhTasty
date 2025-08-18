import { useEffect, useRef } from "react";
import RecipeCardSimp from "../RecipeCardSimple"
import "./RecipeCardSimpleList.css";
import LoadingSpinner from "../../../../components/ui/Spinner/LoadingSpinner";

const RecipeCardSimpleList = ({ recipes, loadMore, isLoadingRecipes, hasMoreRecipes }) => {
    const loaderRef = useRef(null);

    useEffect(() => {
        console.info("useEffect loadMoreRecipes")
        if (!loaderRef.current || !recipes || recipes.length<=0) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting) {
                    // console.log("Chạm cuối → Gọi API load thêm dữ liệu");
                    hasMoreRecipes && loadMore();
                }
            },
            { threshold: 0 }
        );

        observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [recipes]);
    return (
        <main className="p-2 recipe-grid">
            {recipes?.map((recipe) => (
                <RecipeCardSimp recipe={recipe} />
            ))}
            <div ref={loaderRef} className="p-2"/>
            {isLoadingRecipes && <LoadingSpinner size='sm' text='Đang tải bình luận...' />}
        </main>
    )
}

export default RecipeCardSimpleList;