import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../../configs/Apis";
import { AppContext } from "../../../provides/AppProvider";
import { printErrors } from "../../../utils/printErrors";
import NameAndImageRecipeListPreview from "../../recipes/components/NameAndImageRecipeListPreview";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon"
import { FaUtensils } from "react-icons/fa";

const ProfileOverview = () => {
    const { currentUser } = useContext(AppContext)
    const [recipePage, setRecipePage] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.info("currentUser: ", JSON.stringify(currentUser, null, 2))
                const api = await authApis();
                const res = await api.get(`${endpoints.user.recipes(currentUser.id)}?level=basic&page_size=5`)
                setRecipePage(res.data)
            } catch (err) {
                printErrors(err)
            }
        }
        fetchData();
    }, [])

    const onClickExtraImage = () => {
        nav('recipes')
    }

    const handleAddRecipe = async () => {
        try{
            const api = await authApis()
            let response;
            let newRecipeId;

            response = await api.get(endpoints.recipes.draft.lastest);
            newRecipeId = response.data._id;
            if (!newRecipeId) {
                response = await api.post(endpoints.recipes.draft.list);
                newRecipeId = response.data._id;
            }

            // Điều hướng sang trang edit với id mới
            nav(`/recipes-draft/${newRecipeId}/edit`);
        }catch(err){
            printErrors(err);
        }
    }
    return (<>
        {recipePage && <div className="d-flex flex-column p-3">
            <div className="d-flex justify-content-between align-items-center p-1">
                <div>
                    <h5>Các món đã đăng ({recipePage.count} món)</h5>
                </div>
                <div className="btn btn-primary" onClick={handleAddRecipe}>
                    Thêm món mới
                </div>
            </div>
            <NameAndImageRecipeListPreview visibleRecipes={recipePage.results} count={recipePage.count} onClickExtraImage={onClickExtraImage} />
            <div className="d-flex justify-content-end">
                <div className="btn btn-light" style={{ color: "purple" }} onClick={() => nav('recipes')}>
                    Xem tất cả các món ăn
                </div>
            </div>
        </div>}
    </>)
}

export default ProfileOverview;