import { FaHome, FaSearch, FaLeaf, FaUtensils, FaBookmark, FaCog, FaHamburger } from "react-icons/fa";
import MenuItemWithIcon from "../ui/MenuItemWithIcon";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../provides/AppProvider";
import LoginDialog from "../../features/auth/components/LoginDialog";
import { IoMdNotifications } from "react-icons/io";
import { authApis, endpoints } from "../../configs/Apis";


const MenuItemWithIconExtend = ({ icon, label, to, loginMessage, showLoginModal, setShowLoginModal, notificationCount }) => {
  // console.info("notificationCount: ", notificationCount)
  const navigate = useNavigate();
  const { currentUser } = useContext(AppContext);
  return (
    <>
      <MenuItemWithIcon className="btn btn-light mb-2" icon={icon} label={label} notificationCount={notificationCount}
        onClick={() => {
          currentUser ? navigate(to) : setShowLoginModal(true)
        }} />

      <LoginDialog {...{ showModal: showLoginModal, setShowModal: setShowLoginModal, to }}
        message={loginMessage} />
    </>
  )
}

const SidebarMenuList = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const { currentUser } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fecthData = async () => {
      console.info("fecthData !!!")
      if (!currentUser)
        return;
      try {
        console.info("const api = await authApis();")
        const api = await authApis();
        const res = await api.get(endpoints.currentUser.notifications.count);
        console.info("res.data: ", res.data)
        setNotificationCount(res.data.count)
      } catch (err) {

      }
    }
    fecthData();
  }, [currentUser]);
  return (
    <nav className="nav flex-column">
      <MenuItemWithIcon className="btn btn-light mb-2" icon={<FaHome size={22} />} label="Trang chủ" onClick={() => navigate("/")} />
      {/* <SidebarMenuItem icon={<FaSearch />} label="Khám phá" to="/explore" />
      <SidebarMenuItem icon={<FaLeaf />} label="Nguyên liệu" to="/ingredients" /> */}
      <MenuItemWithIconExtend icon={<FaUtensils size={22} />} label="Thêm món mới"
        to="/recipes-draft" loginMessage="Đăng ký hoặc đăng nhập để thêm món mới!"
        {...{ showLoginModal, setShowLoginModal }}
      />

      <MenuItemWithIconExtend icon={<FaHamburger size={22} />} label="Món của bạn"
        to="/profile/recipes" loginMessage="Đăng ký hoặc đăng nhập để xem các món ăn của bạn!"
        {...{ showLoginModal, setShowLoginModal }}
      />

      <div onClick={() => setNotificationCount(0)}>
        <MenuItemWithIconExtend icon={<IoMdNotifications size={22} />} label="Thông báo" notificationCount={notificationCount}
          to="/profile/notifications" loginMessage="Đăng ký hoặc đăng nhập để xem thông báo của bạn!"
          {...{ showLoginModal, setShowLoginModal }}
        />
      </div>

    </nav>
  );
};

export default SidebarMenuList;