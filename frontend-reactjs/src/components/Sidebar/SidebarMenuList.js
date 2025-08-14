import { FaHome, FaSearch, FaLeaf, FaUtensils, FaBookmark, FaCog } from "react-icons/fa";
import MenuItemWithIcon from "../ui/MenuItemWithIcon";
import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../../provides/AppProvider";
import LoginDialog from "../../features/auth/components/LoginDialog";

const SidebarMenuItem = ({ icon, label, to, requireLogin = false, messageLogin }) => {
  const [showModal, setShowModal] = useState(false);
  const handleClick = (e) => {
    if (requireLogin) {
      e.preventDefault();
      setShowModal(true);
      return;
    }
    // Nếu được phép thì link bình thường hoạt động
  };

  return (
    <>
      <Link to={to} onClick={handleClick} className="text-decoration-none text-dark mb-3">
        <MenuItemWithIcon icon={icon} label={label} />
      </Link>
      {requireLogin && <LoginDialog {...{showModal, setShowModal, to}} message = {messageLogin}/>}
    </>
  )
}

const SidebarMenuList = () => {
  const { currentUser } = useContext(AppContext);
  return (
    <nav className="nav flex-column">
      <SidebarMenuItem icon={<FaHome />} label="Trang chủ" to="/" />
      {/* <SidebarMenuItem icon={<FaSearch />} label="Khám phá" to="/explore" />
      <SidebarMenuItem icon={<FaLeaf />} label="Nguyên liệu" to="/ingredients" /> */}
      <SidebarMenuItem icon={<FaUtensils />} label="Thêm món mới" to="/recipes-draft" requireLogin={!currentUser} messageLogin={"Đăng ký hoặc đăng nhập để thêm món mới!!"}/>
      <SidebarMenuItem icon={<FaBookmark />} label="Đã lưu" to="/saved" />
      <SidebarMenuItem icon={<FaCog />} label="Cài đặt" to="/settings" />
    </nav>
  );
};

export default SidebarMenuList;