import { FaBars } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Header.css";
import { AppContext } from "../../../provides/AppProvider";
import { useContext } from "react";
import LoginButtonWithDialog from "../../../dialogs/LoginButtonWithDialog";
import { ActionType } from "../../../reducers/AuthReducer";

const Header = () => {
    const { currentUser, currentUserDispatch } = useContext(AppContext);
    // const currentUserInfo = currentUser.user

    const handleLogout = () => {
        currentUserDispatch({ type: ActionType.LOGOUT });
    }
    return (
        <header className="d-flex align-items-center justify-content-between p-3 shadow bg-white sticky-top mt-2 mx-2 rounded">
            <button
                className="btn btn-outline-secondary d-md-none me-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileSidebar"
            >
                <FaBars size={20} />
            </button>

            <input
                type="text"
                className="form-control flex-grow-1 me-3"
                placeholder="Tìm món ăn, nguyên liệu..."
            />

            {/* <div className="dropdown">
                <button
                    className="btn btn-light dropdown-toggle d-flex align-items-center"
                    type="button"
                    id="dropdownMenuButton"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                >
                    <img
                        src="https://res.cloudinary.com/dedsaxk7j/image/upload/v1749456346/wyppshgkujdyyeumsw4g.png"
                        alt="Avatar"
                        className="rounded-circle me-2"
                        style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                    <span className="d-none d-md-inline">Mạnh</span>
                </button>

                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                    <li><a className="dropdown-item" href="#">Hồ sơ</a></li>
                    <li><a className="dropdown-item" href="#">Cài đặt</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a className="dropdown-item text-danger" href="#">Đăng xuất</a></li>
                </ul>
            </div> */}
            {currentUser ? (<>
                <div className="dropdown">
                    <button
                        className="btn btn-light dropdown-toggle d-flex align-items-center justify-content-center"
                        type="button"
                        id="dropdownMenuButton"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                    >
                        <img
                            src={currentUser.avatar}
                            alt="Avatar"
                            className="rounded-circle me-2"
                            style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                        />
                        <span className="d-none d-md-inline">{`${currentUser.last_name} ${currentUser.first_name}`}</span>
                    </button>

                    <ul className="dropdown-menu dropdown-menu-end p-2 shadow" style={{ width: '300px' }}>
                        <li className="mb-2">
                            <Link to="/profile" className="profile-link text-decoration-none text-dark d-block">
                                <div className="d-flex align-items-start">
                                    <img
                                        src="https://res.cloudinary.com/dedsaxk7j/image/upload/v1749456346/wyppshgkujdyyeumsw4g.png"
                                        alt="Avatar"
                                        className="rounded-circle me-3"
                                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                    />
                                    <div className="flex-grow-1">
                                        <div className="fw-bold">Mạnh Lê Đức</div>
                                        {/* <div className="text-muted" style={{ fontSize: '0.85rem' }}>Personal</div> */}
                                        <div className="text-muted" style={{ fontSize: '0.85rem' }}>2251012090manh@ou.edu.vn</div>
                                    </div>
                                    <div className="ms-2 text-success">✔️</div>
                                </div>
                            </Link>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li><button className="dropdown-item text-danger" onClick={handleLogout}>Đăng xuất</button></li>
                    </ul>
                </div>
            </>) : (<>
                <LoginButtonWithDialog />
            </>)}

        </header>
    )
}

export default Header;