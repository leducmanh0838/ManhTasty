import { FaHome, FaSearch, FaLeaf, FaUtensils, FaBookmark, FaCog } from "react-icons/fa";
import MenuItem from '../MenuItem';

const MenuList = () => {
  return (
    <nav className="nav flex-column">
      <MenuItem icon={<FaHome />} label="Trang chủ" to="/" />
      <MenuItem icon={<FaSearch />} label="Khám phá" to="/explore" />
      <MenuItem icon={<FaLeaf />} label="Nguyên liệu" to="/ingredients" />
      <MenuItem icon={<FaUtensils />} label="Thêm món mới" to="/create-recipe" />
      <MenuItem icon={<FaBookmark />} label="Đã lưu" to="/saved" />
      <MenuItem icon={<FaCog />} label="Cài đặt" to="/settings" />
    </nav>
  );
};

export default MenuList;