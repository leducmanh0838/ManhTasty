import { useEffect, useState } from "react";
import "./Home.css";
import Apis, { endpoints } from "../configs/Apis";
import RecipeCardSimpleList from "../features/recipes/components/RecipeCardSimpleList";
import LoadingSpinner from "../components/ui/Spinner/LoadingSpinner";
import usePagination from "../hooks/usePagination";
import GridTagCategorySimpleList from "../features/tags/components/GridTagCategorySimpleList";

const HomePage = () => {
    // const [recipePage, setRecipePage] = useState(null);
    const {
        resultData: recipes,
        // setResultData: setRecipes,
        loading,
        loadMore,
        refresh,
        hasMore,
        page,
    } = usePagination({ endpoint: endpoints.recipes.list, isLoadFirstData: true });

    return (
        <>
            <div className="p-2">
                <GridTagCategorySimpleList />
                {
                    recipes ? (
                        <RecipeCardSimpleList recipes={recipes} loadMore={loadMore} isLoadingRecipes={loading} hasMoreRecipes={hasMore} />
                    ) : (
                        <LoadingSpinner />
                    )
                }
            </div>
        </>
    )
}

export default HomePage;