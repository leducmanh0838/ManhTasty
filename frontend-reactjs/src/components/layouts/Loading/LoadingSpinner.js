import { Spinner } from "react-bootstrap";

const LoadingSpinner = () => {
    return (
        <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" variant="light">
                <span className="visually-hidden">Đang tải...</span>
            </Spinner>
        </div>
    );
}

export default LoadingSpinner;