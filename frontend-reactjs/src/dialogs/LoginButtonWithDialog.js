import { useState } from 'react';
import { Modal} from 'react-bootstrap'; // dùng react-bootstrap cho tiện
import FacebookLogin from '../components/layouts/buttons/FacebookLogin';
import MyGoogleLogin from '../components/layouts/buttons/MyGoogleLogin';

const LoginButtonWithDialog = () => {
    const [showModal, setShowModal] = useState(false);
    const avatarSize = 200;

    return (
        <>
            <button
                className="btn btn-outline-primary d-flex align-items-center text-nowrap"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Đăng nhập
            </button>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0"></Modal.Header>
                <Modal.Body className="text-center p-4">
                    <div className="text-center fw-bold fs-4 mb-4 d-flex flex-column align-items-center mx-3">
                        <img
                            src="/icons/logo.png"
                            alt="ManhTasty Logo"
                            style={{ width: `${avatarSize}px`, height: `${avatarSize}px`, marginBottom: '8px' }}
                        />
                        <div>
                            <span style={{ fontFamily: 'Arial Black', color: '#f57c00' }}>Manh</span>
                            <span style={{ fontFamily: 'Pacifico, cursive', color: '#6d4c41' }}>Tasty</span>
                        </div>
                    </div>
                    <h5 className="mb-3">Đăng nhập</h5>

                    {/* <button className="btn btn-dark w-100 mb-2 d-flex align-items-center justify-content-center">
                        <i className="bi bi-google me-2"></i> Tiếp tục với Google
                    </button> */}
                    <MyGoogleLogin setShowModal={setShowModal}/>

                    {/* <div className="d-flex align-items-center my-3">
            <hr className="flex-grow-1" />
            <span className="mx-2 text-muted">hoặc</span>
            <hr className="flex-grow-1" />
          </div> */}
                    <FacebookLogin setShowModal={setShowModal}/>

                    {/* <button className="btn btn-light w-100 d-flex align-items-center justify-content-center border">
                        <i className="bi bi-facebook me-2"></i> Tiếp tục với Facebook
                    </button> */}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginButtonWithDialog;
