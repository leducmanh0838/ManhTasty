import { useState } from "react";
import { HiChevronDown, HiChevronUp } from "react-icons/hi";
import MenuItemWithIcon from "../ui/MenuItemWithIcon";
import { FaExclamationTriangle, FaFlag, FaTrashAlt } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const ShowSettingMenuButton = ({ }) => {
    const [showSettingMenu, setShowSettingMenu] = useState(false);
    const nav = useNavigate();
    return (
        <>
            <div className="nav-link d-flex align-items-center text-dark text-nowrap btn btn-light p-2" onClick={() => setShowSettingMenu(prev => !prev)}>
                <span className="me-2"><IoSettingsSharp /></span>
                <span className="me-2">Cài đặt</span>
                <span>{showSettingMenu ? <HiChevronDown size={20} /> : <HiChevronUp size={20} />}</span>
            </div>
            {showSettingMenu && <div className="ms-4">
                <MenuItemWithIcon icon={<FaTrashAlt />} label="Thùng rác" className="btn btn-light p-2" onClick={()=>nav('/profile/trashes')} />
                {/* <MenuItemWithIcon icon={<FaFlag />} label="Tôi đã báo cáo" className="btn btn-light p-2" />
                <MenuItemWithIcon icon={<FaExclamationTriangle />} label="Bị báo cáo" className="btn btn-light p-2" /> */}
            </div>}
        </>
    )
}

export default ShowSettingMenuButton;