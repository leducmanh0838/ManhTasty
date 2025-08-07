import { FACEBOOK_APP_ID } from '../../../configs/Values';
import { FaFacebookF } from 'react-icons/fa';
import { useEffect } from 'react';


// const FacebookLogin = ({ onSubmitLogin }) => {
//   const login = useLogin();
//   const [loading, setLoading] = useState(false);
//   // const { currentUserDispatch, tokenDispatch} = useContext(AppContext);
//   const handleSuccess = async (response) => {
//     console.log('Login Success:', response);
//     try {
//       setLoading(true);
//       const accessToken = response.data.accessToken;
//       const res = await Apis.post(endpoints.login.facebook, {
//         accessToken,
//       });
//       console.log("res data:", res.data);
//       login(res.data);
//       setShowModal(false)
//       // const token = res.data.access_token;
//       // cookie.save('token', token, {
//       //   path: ',',
//       //   // maxAge: USER_MAX_AGE
//       // });
//       // dispatch({
//       //   "type": "login",
//       //   "payload": res.data.user
//       // });

//       // currentUserDispatch({
//       //   "type": "login",
//       //   "payload": res.data
//       // });

//     } catch (error) {
//       if (error.response && error.response.data && error.response.data.message) {
//         alert(error.response.data.message);
//       }
//       if (error.response) {
//         console.error("Lỗi backend:", error.response.data);
//       } else if (error.request) {
//         console.error("Không nhận được phản hồi từ server:", error.request);
//       } else {
//         console.error("Lỗi khi gửi yêu cầu:", error.message);
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleError = (error) => {
//     console.error('Login Failed:', error);
//   };

//   return (
//     <>
//     </>
//   );
// };

const FacebookLogin = ({submitSocialLogin}) => {
  useEffect(() => {
    // Chỉ thêm SDK nếu chưa có
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        window.FB.init({
          appId: FACEBOOK_APP_ID, // ← Thay bằng App ID thật
          cookie: true,
          xfbml: false,
          version: "v19.0", // ← Có thể thay bằng version mới nhất
        });
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleFacebookLogin = () => {
    if (!window.FB) {
      console.info("!window.FB")
      return;
    }

    window.FB.login((response) => {
      response?.authResponse && submitSocialLogin("facebook", response.authResponse.accessToken);
    });
  };

  return (
    <button onClick={handleFacebookLogin}
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
  );
};

export default FacebookLogin;
