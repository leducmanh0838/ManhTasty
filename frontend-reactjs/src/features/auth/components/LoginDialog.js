import { Modal} from 'react-bootstrap'; // dùng react-bootstrap cho tiện
import Login from './Login'

const LoginDialog = ({showModal, setShowModal, message = "Đăng nhập"}) => {

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0"></Modal.Header>
                <Modal.Body className="text-center p-4">
                    <Login setShowModal={setShowModal} message={message}/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginDialog;
