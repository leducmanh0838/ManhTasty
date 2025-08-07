import { useContext } from "react";
import { AppContext } from "../../provides/AppProvider";
import LoginDialogButton from "../../features/auth/components/LoginDialogButton";
import HeaderProfile from "../../features/profile/components/HeaderProfile";

const HeaderAuth = () => {
    const { currentUser } = useContext(AppContext);
    
    return (
        <>
            {currentUser ? (<>
                <HeaderProfile/>
            </>) : (<>
                <LoginDialogButton/>
            </>)}
        </>
    )
}
export default HeaderAuth;