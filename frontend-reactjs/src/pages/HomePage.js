import { useEffect, useState } from "react";
import "./Home.css";
import Apis, { endpoints } from "../configs/Apis";
import RecipeCardSimpleList from "../features/recipes/components/RecipeCardSimpleList";
import LoadingSpinner from "../components/ui/Spinner/LoadingSpinner";
import usePagination from "../hooks/usePagination";

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

    // useEffect(() => {
    //     Apis.get(endpoints.home.recipesList)
    //         .then(res => setRecipePage(res.data))
    //     // .then(setRecipes(prev => [...prev, ...x]))
    // }, []);

    return (
        recipes ? (
            <RecipeCardSimpleList recipes={recipes} loadMore={loadMore} isLoadingRecipes={loading} hasMoreRecipes={hasMore} />
        ) : (
            <LoadingSpinner/>
        )
    )
}

export default HomePage;