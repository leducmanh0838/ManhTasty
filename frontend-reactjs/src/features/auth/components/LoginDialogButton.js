import { useState } from 'react';
import { Modal} from 'react-bootstrap'; // dùng react-bootstrap cho tiện
import Login from './Login'
import LoginDialog from './LoginDialog';

const LoginDialogButton = () => {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <button
                className="btn btn-outline-primary d-flex align-items-center text-nowrap"
                onClick={() => setShowModal(true)}
            >
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Đăng nhập
            </button>
            <LoginDialog showModal={showModal} setShowModal={setShowModal}/>
        </>
    );
};

export default LoginDialogButton;
