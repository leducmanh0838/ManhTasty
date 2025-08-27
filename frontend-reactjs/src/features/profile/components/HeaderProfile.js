import { useContext } from "react";
import { AppContext } from "../../../provides/AppProvider";
import Avatar from "../../../components/ui/Avatar";
import HeaderProfileDropdown from "./HeaderProfileDropdown";

const HeaderProfile = () => {
    const { currentUser } = useContext(AppContext);
    return (
        <div className="dropdown">
            <button
                className="btn btn-light dropdown-toggle d-flex align-items-center justify-content-center"
                type="button"
                id="dropdownMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                <Avatar src={currentUser.avatar} />
                <span className="d-none d-md-inline">{`${currentUser.last_name} ${currentUser.first_name}`}</span>
            </button>

            <HeaderProfileDropdown/>
        </div>
    )
}

export default HeaderProfile;