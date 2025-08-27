import { useContext } from "react";
import { AppContext } from "../../../provides/AppProvider";
import Avatar from "../../../components/ui/Avatar"
import { Outlet, useNavigate } from "react-router-dom";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import { TiPencil } from "react-icons/ti";
import ShowSettingMenuButton from "../../../components/buttons/ShowSettingMenuButton";


const ProfilePage = ({ }) => {
    const { currentUser } = useContext(AppContext)
    const nav = useNavigate();

    return (<>
        <div className="container p-3">
            <div className="row">
                <div className="col-3 d-flex flex-column align-items-center p-3">
                    <Avatar size={200} src={currentUser?.avatar} onClick={() => nav('/profile')} className="cursor-pointer" />
                    <h4 className="my-3">
                        {`${currentUser?.last_name} ${currentUser?.first_name}`}
                    </h4>
                    <div className="w-100 p-1">
                        {/* <MenuItemWithIcon icon={<TiPencil />} label="Chỉnh sửa thông tin" className="btn btn-light p-2" /> */}
                        <ShowSettingMenuButton />

                    </div>
                </div>
                <div className="col-9">
                    <Outlet />
                </div>

            </div>
        </div>
    </>)
}

export default ProfilePage;