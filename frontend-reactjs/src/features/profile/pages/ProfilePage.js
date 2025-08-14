import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import Avatar from "../../../components/ui/Avatar"
import { authApis, endpoints } from "../../../configs/Apis";
import NameAndImageRecipe from "../../recipes/components/NameAndImageRecipe";
import { printErrors } from "../../../utils/printErrors";
import NameAndImageRecipeListPreview from "../../recipes/components/NameAndImageRecipeListPreview";
import { useNavigate } from "react-router-dom";

const ProfilePage = ({ }) => {
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
        nav(`/users/${currentUser.id}/recipes`)
    }

    return (<>
        <div className="container p-3">
            <div className="row">
                <div className="col-3 d-flex flex-column align-items-center p-3">
                    <Avatar size={200} src={currentUser.avatar} />
                    <h4 className="my-3">
                        {`${currentUser.last_name} ${currentUser.first_name}`}
                    </h4>
                </div>
                {recipePage && <div className="col-9 d-flex flex-column p-3">
                    <h5>Các món đã đăng ({recipePage.count} món)</h5>
                    <NameAndImageRecipeListPreview visibleRecipes={recipePage.results} count={recipePage.count} onClickExtraImage={onClickExtraImage} />
                </div>}
            </div>
        </div>
    </>)
}

export default ProfilePage;