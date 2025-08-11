// import { useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Header.css";
import DefaultHeader from "./DefaultHeader";

const Header = () => {
    const location = useLocation();
    const headerConfig = {
        "/recipes-draft": <></>,
        // các route khác nếu cần
    };

    const prefixKey = Object.keys(headerConfig).find(key =>
        location.pathname.startsWith(key)
    );

    const header = prefixKey ? headerConfig[prefixKey] : <DefaultHeader />;

    // const showHeader = !location.pathname.startsWith('/profile');
    return (
        <>
            {header}
        </>
    )
}

export default Header;

// import { useLocation } from 'react-router-dom';

// const headerConfig = {
//   "/": <HomeHeader />,
//   "/profile": <ProfileHeader />,
//   "/dashboard": <DashboardHeader />,
//   // có thể thêm nhiều route và header tương ứng
// };

// const Header = () => {
//   const location = useLocation();
//   const header = headerConfig[location.pathname] || <DefaultHeader />;

//   return (
//     <header>
//       {header}
//     </header>
//   );
// };
