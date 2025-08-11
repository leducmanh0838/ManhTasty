import { useState } from "react";
import { useLogin } from "../../../utils/Auth";
import Apis, { endpoints } from "../../../configs/Apis";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import MyGoogleLogin from "./MyGoogleLogin";
import FacebookLogin from "./FacebookLogin";
import ManhTastyLogo from "../../../components/ui/ManhTastyLogo";
import { useNavigate } from "react-router-dom";

const Login = ({ setShowModal, message = "Đăng nhập", to}) => {
    const login = useLogin();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const hanldeSubmitSocialLogin = async (typeLogin, accessToken) => {
        console.info("typeLogin: ", typeLogin);
        console.info("accessToken: ", accessToken);

        try {
            setLoading(true);
            let res;
            if (typeLogin === "google")
                res = await Apis.post(endpoints.auth.login.google, { idToken: accessToken });
            else if (typeLogin === "facebook")
                res = await Apis.post(endpoints.auth.login.facebook, { accessToken });

            login(res.data);
            to && navigate(to);
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
                <ManhTastyLogo link={false} />
            </div>
            <h5 className="mb-3">{message}</h5>

            {loading ? <LoadingSpinner text="Đang đăng nhập..." /> : <>
                <MyGoogleLogin submitSocialLogin={hanldeSubmitSocialLogin} />
                <FacebookLogin submitSocialLogin={hanldeSubmitSocialLogin} />
            </>}
        </div>
    )
}
export default Login;