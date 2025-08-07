import { useContext, useEffect, useState } from "react";
import RecipeItemType2 from "./RecipeItemType2";
import { useSearchParams } from "react-router-dom";
import Apis, { authApis, endpoints } from "../../configs/Apis";
import { AppContext } from "../../provides/AppProvider";

const Search = () => {
    const { currentUser } = useContext(AppContext);
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") || "";
    const [recipes, setRecipes] = useState([]);

    const params = new URLSearchParams({
        keyword,
        page:1
    });

    useEffect(() => {

        const fetchData = async () => {
            try {
                console.info("url: ", `${endpoints.recipes.search}?${params.toString()}`);
                const api = currentUser? await authApis():Apis;
                const res = await api.get(`${endpoints.recipes.search}?${params.toString()}`);
                setRecipes(res.data.results);
            } catch (error) {

            }
        }

        fetchData();
    }, [keyword]);

    return (
        <div className="p-3">
            <div className="row">
                {recipes.map((recipe, index) => (
                    <div className="col-12 col-md-6 mb-4" key={index}>
                        <RecipeItemType2 recipe={recipe} />
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Search;