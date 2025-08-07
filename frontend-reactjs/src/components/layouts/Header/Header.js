import { FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import { AppContext } from "../../../provides/AppProvider";
import { useContext, useState } from "react";
import LoginButtonWithDialog from "../../../dialogs/LoginButtonWithDialog";
import { ActionType } from "../../../reducers/AuthReducer";
import { useLogout } from "../../../utils/Auth";

const keywordSuggestions = [
        "Phở bò",
        "Bún chả",
        "Gà kho gừng",
        "Canh chua",
        "Trứng chiên",
        "Bánh xèo",
    ];

const Header = () => {
    const logout = useLogout();
    const { currentUser } = useContext(AppContext);
    const [keyword, setKeyword] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    // const currentUserInfo = currentUser.user

    const [suggestions, setSuggestions] = useState(keywordSuggestions);

    const handleLogout = () => {
        // currentUserDispatch({ type: ActionType.LOGOUT });
        logout();
    }

    const handleSubmitKeyword = (e) => {
        e.preventDefault();
        // setShowDropdown(false);
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    }

    const handleSelectKeyword = (kw) =>{
        navigate(`/search?keyword=${encodeURIComponent(kw)}`);
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

            {/* <input
                type="text"
                className="form-control flex-grow-1 me-3"
                placeholder="Tìm món ăn, nguyên liệu..."
            /> */}
            <form onSubmit={handleSubmitKeyword} className="d-flex flex-grow-1 me-3">
                <div className="position-relative flex-grow-1">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Tìm món ăn, nguyên liệu..."
                        value={keyword}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay để click vào item
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    {showDropdown && suggestions.length > 0 && (
                        <ul
                            className="list-group position-absolute shadow"
                            style={{
                                zIndex: 999,
                                top: "110%",
                                width: "100%",
                            }}
                        >
                            {suggestions.map((item, index) => (
                                <li
                                    key={index}
                                    className="list-group-item list-group-item-action"
                                    style={{ cursor: "pointer" }}
                                    onMouseDown={() => handleSelectKeyword(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </form>

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
                                        src={currentUser.avatar}
                                        alt="Avatar"
                                        className="rounded-circle me-3"
                                        style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                                    />
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