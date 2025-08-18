import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApis, endpoints } from "../../../configs/Apis";
import { AppContext } from "../../../provides/AppProvider";
import { printErrors } from "../../../utils/printErrors";
import NameAndImageRecipeListPreview from "../../recipes/components/NameAndImageRecipeListPreview";

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
        nav(`recipes`)
    }
    return (<>
        {recipePage && <div className="d-flex flex-column p-3">
            <h5>Các món đã đăng ({recipePage.count} món)</h5>
            <NameAndImageRecipeListPreview visibleRecipes={recipePage.results} count={recipePage.count} onClickExtraImage={onClickExtraImage} />
        </div>}
    </>)
}

export default ProfileOverview;