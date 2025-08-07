import { useEffect, useState } from "react";
import "./Home.css";
import { BiDotsHorizontalRounded, BiShareAlt } from "react-icons/bi";
import Apis, { endpoints } from "../../configs/Apis";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/Common";
import RecipeItem from "./RecipeItem";

const HomePage = () => {
    const [recipes, setRecipes] = useState([]);
    useEffect(()=>{
        Apis.get(endpoints.home.recipes)
        .then(res => setRecipes(res.data.results))
        // .then(setRecipes(prev => [...prev, ...x]))
    }, []);

    return (
        <main className="py-4 px-3 recipe-grid">
            {recipes.map((recipe) => (
                <RecipeItem recipe={recipe}/>
            ))}
        </main>
    )
}

export default HomePage;