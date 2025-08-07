import { useState } from "react";
import FacebookLogin from "../../../components/layouts/buttons/FacebookLogin";
import MyGoogleLogin from "../../../components/layouts/buttons/MyGoogleLogin";
import ManhTastyLogo from "../../../components/ManhTastyLogo"
import { useLogin } from "../../../utils/Auth";
import Apis, { endpoints } from "../../../configs/Apis";
import MySpinner from "../../../components/ui/MySpinner";

const Login = ({ setShowModal }) => {
    const login = useLogin();
    const [loading, setLoading] = useState(false);
    const hanldeSubmitSocialLogin = async (typeLogin, accessToken) => {
        console.info("typeLogin: ", typeLogin);
        console.info("accessToken: ", accessToken);

        try {
            setLoading(true);
            let res;
            if (typeLogin === "google")
                res = await Apis.post(endpoints.login.google, { idToken: accessToken });
            else if (typeLogin === "facebook")
                res = await Apis.post(endpoints.login.facebook, { accessToken });

            login(res.data);
            setShowModal(false);
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
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="text-center">
            <div className="fw-bold fs-4 d-flex flex-column align-items-center mx-3">
                <ManhTastyLogo link={false}/>
            </div>
            <h5 className="mb-3">Đăng nhập</h5>

            {loading ? <MySpinner text="Đang đăng nhập..." /> : <><MyGoogleLogin
                submitSocialLogin={hanldeSubmitSocialLogin} />
                <FacebookLogin submitSocialLogin={hanldeSubmitSocialLogin} />
            </>}
        </div>
    )
}
export default Login;