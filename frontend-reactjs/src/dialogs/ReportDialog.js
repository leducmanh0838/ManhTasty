import { useContext, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { reportReasons } from "../configs/Types";
import { toast } from "react-toastify";
import { AppContext } from "../provides/AppProvider";
import { authApis, endpoints } from "../configs/Apis";
import { BsCheckCircle } from "react-icons/bs";

const ReportDialog = ({ objectId, showModal, setShowModal, contentType}) => {
    const { currentUser } = useContext(AppContext);
    const [reason, setReason] = useState(null);
    const [description, setDescription] = useState("");
    // const [showModal, setShowModal] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (!currentUser) {
            toast.warning("Bạn chưa đăng nhập để báo cáo");
            return;
        }
        if (reason) {
            try {
                const api = await authApis();  // chỗ này gọi API instance có token
                const resRepost = await api.post(endpoints.reports.reports, {
                    "object_id": objectId,
                    "content_type": contentType,
                    reason,
                    description
                });
                // const emotionId = resMyEmotion.data.emotion;
                setIsSuccess(true);
            } catch (error) {

            }
        } else {
            toast.warning("Bạn chưa chọn lý do");
        }
    };

    return (
        <>
            {/* <button className="btn btn-light btn-sm text-start w-100"
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowModal(true);
                }}
            >
                🚩 Báo cáo
            </button> */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Báo cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSuccess ? <div className="text-center p-4">
                        <BsCheckCircle size={64} color="green" className="mb-3" />

                        <h4 className="fw-bold">Cảm ơn bạn đã báo cáo</h4>
                        <p className="text-muted">
                            Chúng tôi đã nhận được báo cáo của bạn. Nội dung này sẽ được xem xét để đảm bảo cộng đồng luôn an toàn và tích cực.
                        </p>

                        {/* <button className="btn btn-primary mt-3" onClick={() => setShowModal(false)}>
                            Ok
                        </button> */}
                    </div> : <Form>
                        {reportReasons.map((item) => (
                            <Form.Check
                                key={item.value}
                                type="radio"
                                id={item.value}
                                name="reportReason"
                                value={item.value}
                                checked={reason === item.value}
                                onChange={(e) => setReason(parseInt(e.target.value))}
                                label={
                                    <>
                                        <div className="fw-bold">{item.label}</div>
                                        <small className="text-muted">{item.sub}</small>
                                    </>
                                }
                                className="mb-3"
                            />
                        ))}

                        <Form.Group className="mt-3">
                            <Form.Label>Thêm mô tả (tuỳ chọn)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Viết thêm mô tả nếu bạn muốn..."
                            />
                        </Form.Group>
                    </Form>}

                </Modal.Body>
                <Modal.Footer>
                    {isSuccess?<Button variant="success" onClick={() => setShowModal(false)}>
                        Ok
                    </Button>:<Button variant="danger" onClick={handleSubmit}>
                        Báo cáo
                    </Button>}
                    
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReportDialog;
