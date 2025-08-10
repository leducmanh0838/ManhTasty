import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { WEB_CLIENT_ID } from "../../../configs/Values";
// import cookie from "react-cookies"
// import { AppContext } from "../../../provides/AppProvider";
// import { useContext } from "react";


const MyGoogleLogin = ({ submitSocialLogin }) => {
    const handleSubmitLogin = async (response) => {
        response?.credential && submitSocialLogin("google", response.credential)
    }

    return (
        <div className="w-100 mb-2  justify-content-center">
            <GoogleOAuthProvider clientId={WEB_CLIENT_ID}>
                <GoogleLogin
                    onSuccess={handleSubmitLogin}
                    onError={() => console.log("Login thất bại")}
                    width="100%"
                    useOneTap={false}
                    size="large"
                    shape="pill"
                    theme="filled_black"
                />
            </GoogleOAuthProvider>
        </div>
    )
};

export default MyGoogleLogin;
