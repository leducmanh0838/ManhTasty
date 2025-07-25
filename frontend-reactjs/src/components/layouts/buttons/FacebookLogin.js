import { LoginSocialFacebook } from 'reactjs-social-login';
import { FACEBOOK_APP_ID } from '../../../configs/Values';
import Apis, { endpoints } from '../../../configs/Apis';
import { FaFacebookF } from 'react-icons/fa';
import { useLogin } from '../../../utils/Auth';


const FacebookLogin = ({ setShowModal }) => {
  const login = useLogin();
  // const { currentUserDispatch, tokenDispatch} = useContext(AppContext);
  const handleSuccess = async (response) => {
    console.log('Login Success:', response);
    try {
      const accessToken = response.data.accessToken;
      const res = await Apis.post(endpoints.login.facebook, {
        accessToken,
      });
      console.log("res data:", res.data);
      login(res.data);
      setShowModal(false)
      // const token = res.data.access_token;
      // cookie.save('token', token, {
      //   path: ',',
      //   // maxAge: USER_MAX_AGE
      // });
      // dispatch({
      //   "type": "login",
      //   "payload": res.data.user
      // });

      // currentUserDispatch({
      //   "type": "login",
      //   "payload": res.data
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

  const handleError = (error) => {
    console.error('Login Failed:', error);
  };

  return (
    <LoginSocialFacebook
      appId={FACEBOOK_APP_ID}
      onResolve={handleSuccess}
      onReject={handleError}
      scope="email"
    >
      <button
        className="btn w-100 d-flex align-items-center rounded-pill px-0"
        style={{
          backgroundColor: '#1877F2',
          color: 'white',
          fontSize: '14px',
          fontWeight: '400',
          height: '40px',
        }}
      >
        {/* Icon - sát trái */}
        <div
          className="bg-white d-flex align-items-center justify-content-center rounded-circle ms-0"
          style={{
            width: '38px',
            height: '38px',
          }}
        >
          <FaFacebookF color="#1877F2" size={20} />
        </div>

        {/* Text - chiếm toàn bộ phần còn lại */}
        <div className="flex-grow-1 text-center ">
          Đăng nhập bằng Facebook
        </div>
      </button>
    </LoginSocialFacebook>
  );
};

export default FacebookLogin;
