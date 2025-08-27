// import { useLocation } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./Header.css";
import DefaultHeader from "./DefaultHeader";

const Header = () => {
    const location = useLocation();
    const headerConfig = {
        "/recipes-draft": <></>,
        "/recipes/:id/edit": <></>,
    };

    const prefixKey = Object.keys(headerConfig).find(key => {
        if (key.includes(":id")) {
            const regex = new RegExp("^/recipes/[^/]+/edit$");
            return regex.test(location.pathname);
        }
        return location.pathname.startsWith(key);
    });

    // const prefixKey = Object.keys(headerConfig).find(key =>
    //     location.pathname.startsWith(key)
    // );

    const header = prefixKey ? headerConfig[prefixKey] : <DefaultHeader />;

    // const showHeader = !location.pathname.startsWith('/profile');
    return (
        <>
            {header}
        </>
    )
}

export default Header;