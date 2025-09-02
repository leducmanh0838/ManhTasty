import SearchBar from "../../features/search/components/SearchBar";
import ChatBoxMessageButton from "../buttons/ChatBoxMessageButton";
import HeaderAuth from "./HeaderAuth";
import { FaBars, FaFacebookMessenger } from "react-icons/fa";

const DefaultHeader = () => {
    
    return (
        <>
            <header className="d-flex align-items-center justify-content-between p-3 shadow bg-white sticky-top mt-2 mx-2 rounded">
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
                    <div className="me-2">
                        <ChatBoxMessageButton/>
                    </div>
                    <div>
                        <HeaderAuth />
                    </div>
                </div>
            </header>
        </>
    )
}

export default DefaultHeader;