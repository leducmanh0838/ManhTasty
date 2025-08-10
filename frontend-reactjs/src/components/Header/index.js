import { FaBars } from "react-icons/fa";
import "./Header.css";
import SearchBar from "../../features/search/components/SearchBar";
import HeaderAuth from "./HeaderAuth";

const Header = () => {
    return (
        <header className="d-flex align-items-center justify-content-between p-3 shadow bg-white sticky-top mt-2 mx-2 rounded">
            {/* SidebarToggleButton */}
            <button
                className="btn btn-outline-secondary d-md-none me-2"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#mobileSidebar"
            >
                <FaBars size={20} />
            </button>
            <div className="d-flex w-100 align-items-center">
                <div className="flex-grow-1 me-3">
                    <SearchBar />
                </div>
                <div>
                    <HeaderAuth />
                </div>
            </div>

        </header>
    )
}

export default Header;