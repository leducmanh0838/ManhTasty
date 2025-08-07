import { useEffect, useState } from "react";
import "./Home.css";
import Apis, { endpoints } from "../configs/Apis";
import RecipeCardSimpleList from "../features/recipes/components/RecipeCardSimpleList";
import MySpinner from "../components/ui/MySpinner";

const HomePage = () => {
    const [recipePage, setRecipePage] = useState(null);
    useEffect(() => {
        Apis.get(endpoints.home.recipes)
            .then(res => setRecipePage(res.data))
        // .then(setRecipes(prev => [...prev, ...x]))
    }, []);

    return (
        recipePage && recipePage.results ? (
            <RecipeCardSimpleList recipes={recipePage.results} />
        ) : (
            <MySpinner/>
        )
    )
}

export default HomePage;