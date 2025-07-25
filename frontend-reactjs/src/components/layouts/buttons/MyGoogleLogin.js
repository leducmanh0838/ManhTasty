import { GoogleLogin } from "@react-oauth/google";
import Apis, { endpoints } from "../../../configs/Apis";
import { useLogin } from "../../../utils/Auth";
// import cookie from "react-cookies"
// import { AppContext } from "../../../provides/AppProvider";
// import { useContext } from "react";


const MyGoogleLogin = ({ setShowModal }) => {
    const login = useLogin();

    const googleLoginHandleSuccess = async (credentialResponse) => {
            console.info("googleLoginHandleSuccess")
            console.info(JSON.stringify(credentialResponse, null, 2));
            const idToken = credentialResponse.credential;
            try {
                const res = await Apis.post(endpoints.login.google, {
                    idToken,
                });
                console.log("res data:", res.data);
                login(res.data);
                setShowModal(false);
                // currentUserDispatch({
                //     "type": "login",
                //     "payload": res.data
                // });
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    alert(error.response.data.message);
                }
                if (error.response) {
                    console.error("Lỗi backend:", error.response.data);
                } else if (error.request) {
                    console.error("Không nhận được phản hồi từ server:", error.request);
                } else {
                    console.error("Lỗi khi gửi yêu cầu:", error.message);
                }
            }
        };

    return (
        <div className="w-100 mb-2  justify-content-center">
            <GoogleLogin
                onSuccess={googleLoginHandleSuccess}
                onError={() => console.log("Login thất bại")}
                width="100%"
                useOneTap={false}
                size="large"
                shape="pill"
                theme="filled_black"
            />
        </div>
    )
};

export default MyGoogleLogin;
