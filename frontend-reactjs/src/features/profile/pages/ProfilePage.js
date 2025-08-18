import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../provides/AppProvider";
import Avatar from "../../../components/ui/Avatar"
import { authApis, endpoints } from "../../../configs/Apis";
import NameAndImageRecipe from "../../recipes/components/NameAndImageRecipe";
import { printErrors } from "../../../utils/printErrors";
import NameAndImageRecipeListPreview from "../../recipes/components/NameAndImageRecipeListPreview";
import { Outlet, useNavigate } from "react-router-dom";

const ProfilePage = ({ }) => {
    const { currentUser } = useContext(AppContext)

    return (<>
        <div className="container p-3">
            <div className="row">
                <div className="col-3 d-flex flex-column align-items-center p-3">
                    <Avatar size={200} src={currentUser.avatar} />
                    <h4 className="my-3">
                        {`${currentUser.last_name} ${currentUser.first_name}`}
                    </h4>
                </div>
                <div className="col-9">
                    <Outlet />
                </div>

            </div>
        </div>
    </>)
}

export default ProfilePage;