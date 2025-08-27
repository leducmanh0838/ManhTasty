import { Link, useLocation, useNavigate } from "react-router-dom";
import Avatar from "../../../components/ui/Avatar";
import { useLogout } from "../../../utils/Auth";
import { useContext } from "react";
import { AppContext } from "../../../provides/AppProvider";
import ShowSettingMenuButton from "../../../components/buttons/ShowSettingMenuButton"
import { CgProfile } from "react-icons/cg";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import { BiLogOut } from "react-icons/bi";



const HeaderProfileDropdown = () => {
    const location = useLocation();
    const logout = useLogout();
    const nav = useNavigate();
    const { currentUser } = useContext(AppContext);

    const handleLogout = () => {
        // Kiểm tra path có bắt đầu bằng /profile
        if (location.pathname.startsWith("/profile")) {
            logout();
            // nav("/", { replace: true });
            nav("/")
        } else {
            logout();
        }
    };
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
            <li>
                <MenuItemWithIcon className="nav-link d-flex align-items-center text-dark text-nowrap btn btn-light p-2"
                    icon={<CgProfile />} label="Xem hồ sơ" onClick={() => nav('/profile')}
                />
                {/* <button className="btn btn-light rounded w-100 d-flex justify-content-start align-items-start" onClick={() => nav('/profile')}>Xem hồ sơ</button> */}
            </li>

            <li className="btn dropdown-item p-0"
                onClick={(e) => {
                    e.preventDefault();      // Ngăn điều hướng mặc định (nếu có <a>)
                    e.stopPropagation();     // Ngăn Bootstrap đóng dropdown
                    console.log("Bạn vừa bấm item nhưng dropdown vẫn mở");
                }}>
                <ShowSettingMenuButton />
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
                <div className={`nav-link d-flex align-items-center text-dark text-nowrap btn btn-light p-2`} onClick={handleLogout}>
                    <span className="me-2" color="red"><BiLogOut color="red" /></span>
                    <span style={{ color: "red" }}>Đăng xuất</span>
                </div>
            </li>
        </ul>
    )
}

export default HeaderProfileDropdown;