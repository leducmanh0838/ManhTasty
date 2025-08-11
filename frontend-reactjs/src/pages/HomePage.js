import { useEffect, useState } from "react";
import "./Home.css";
import Apis, { endpoints } from "../configs/Apis";
import RecipeCardSimpleList from "../features/recipes/components/RecipeCardSimpleList";
import LoadingSpinner from "../components/ui/Spinner/LoadingSpinner";

const HomePage = () => {
    const [recipePage, setRecipePage] = useState(null);
    useEffect(() => {
        Apis.get(endpoints.home.recipesList)
            .then(res => setRecipePage(res.data))
        // .then(setRecipes(prev => [...prev, ...x]))
    }, []);

    return (
        recipePage && recipePage.results ? (
            <RecipeCardSimpleList recipes={recipePage.results} />
        ) : (
            <LoadingSpinner/>
        )
    )
}

export default HomePage;