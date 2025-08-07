import { FaHome, FaSearch, FaLeaf, FaUtensils, FaBookmark, FaCog } from "react-icons/fa";
import MenuItemWithIcon from "../ui/MenuItemWithIcon";

const SidebarMenuList = () => {
  return (
    <nav className="nav flex-column">
      <MenuItemWithIcon icon={<FaHome />} label="Trang chủ" to="/" />
      <MenuItemWithIcon icon={<FaSearch />} label="Khám phá" to="/explore" />
      <MenuItemWithIcon icon={<FaLeaf />} label="Nguyên liệu" to="/ingredients" />
      <MenuItemWithIcon icon={<FaUtensils />} label="Thêm món mới" to="/create-recipe" />
      <MenuItemWithIcon icon={<FaBookmark />} label="Đã lưu" to="/saved" />
      <MenuItemWithIcon icon={<FaCog />} label="Cài đặt" to="/settings" />
    </nav>
  );
};

export default SidebarMenuList;