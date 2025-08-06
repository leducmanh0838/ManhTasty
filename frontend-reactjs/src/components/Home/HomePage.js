import { useEffect, useState } from "react";
import "./Home.css";
import { BiDotsHorizontalRounded, BiShareAlt } from "react-icons/bi";
import Apis, { endpoints } from "../../configs/Apis";
import { Link } from "react-router-dom";
import { slugify } from "../../utils/Common";
import RecipeItem from "./RecipeItem";

const x = [
    {
        id:"2",
        title:"Mì ý sốt bò bằm",
        image:"https://cdn.pixabay.com/photo/2015/04/06/16/21/korean-food-709606_1280.jpg"
    },
    {
        id:"3",
        title:"Cơm trứng thịt bò",
        image:"https://cdn.pixabay.com/photo/2019/02/16/13/03/japan-4000297_1280.jpg"
    },
    {
        id:"4",
        title:"Phở Bò Sài Gòn",
        image:"https://cdn.pixabay.com/photo/2016/01/29/17/08/feast-noodles-1168322_1280.jpg"
    },
    {
        id:"5",
        title:"Thịt heo nướng",
        image:"https://cdn.pixabay.com/photo/2016/01/05/09/48/pork-1122171_1280.jpg"
    },
    {
        id:"6",
        title:"Thịt heo luộc kho",
        image:"https://cdn.pixabay.com/photo/2019/09/17/15/27/roast-pork-4483833_1280.jpg"
    },
    {
        id:"7",
        title:"Món táo",
        image:"https://cdn.pixabay.com/photo/2016/09/29/08/33/apple-1702316_1280.jpg"
    },
    {
        id:"8",
        title:"Chuối chiên",
        image:"https://cdn.pixabay.com/photo/2015/03/30/12/43/bananas-698608_1280.jpg"
    },
    {
        id:"9",
        title:"Ngũ cốc",
        image:"https://cdn.pixabay.com/photo/2014/10/13/15/31/muesli-486832_1280.jpg"
    },
    {
        id:"10",
        title:"Món ngon",
        image:"https://cdn.pixabay.com/photo/2018/11/02/15/21/pork-tenderloin-3790402_1280.jpg"
    },
    {
        id:"11",
        title:"Ngon cực",
        image:"https://cdn.pixabay.com/photo/2020/08/24/03/34/cuisine-5512584_1280.jpg"
    }
    // https://cdn.pixabay.com/photo/2014/10/13/15/31/muesli-486832_1280.jpg
]

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