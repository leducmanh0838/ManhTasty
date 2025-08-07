import { Modal} from 'react-bootstrap'; // dùng react-bootstrap cho tiện
import Login from './Login'

const LoginDialog = ({showModal, setShowModal}) => {

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0"></Modal.Header>
                <Modal.Body className="text-center p-4">
                    <Login/>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default LoginDialog;
