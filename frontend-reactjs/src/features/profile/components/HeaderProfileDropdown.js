import { Link } from "react-router-dom";
import Avatar from "../../../components/ui/Avatar";
import { useLogout } from "../../../utils/Auth";
import { useContext } from "react";
import { AppContext } from "../../../provides/AppProvider";

const HeaderProfileDropdown = () => {
    const logout = useLogout();
    const { currentUser } = useContext(AppContext);
    return (
        <ul className="dropdown-menu dropdown-menu-end p-2 shadow" style={{ width: '300px' }}>
            <li className="mb-2">
                <Link to="/profile" className="profile-link text-decoration-none text-dark d-block">
                    <div className="d-flex align-items-start">
                        <Avatar src={currentUser.avatar} size={48} />
                        <div className="flex-grow-1">
                            <div className="fw-bold">{`${currentUser.last_name} ${currentUser.first_name}`}</div>
                            {/* <div className="text-muted" style={{ fontSize: '0.85rem' }}>Personal</div> */}
                            <div className="text-muted" style={{ fontSize: '0.85rem' }}>{currentUser.email}</div>
                        </div>
                        <div className="ms-2 text-success">✔️</div>
                    </div>
                </Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li><button className="dropdown-item text-danger" onClick={logout}>Đăng xuất</button></li>
        </ul>
    )
}

export default HeaderProfileDropdown;