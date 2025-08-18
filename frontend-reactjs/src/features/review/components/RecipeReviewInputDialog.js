import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import Apis, { authApis, endpoints } from "../../../configs/Apis";
import { BsCheckCircle } from "react-icons/bs";

const RecipeReviewInputDialog = ({ recipeId, showModal, setShowModal }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [currentReview, setCurrentReview] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return; // bắt buộc chọn ít nhất 1 sao
        // onSubmit(rating, comment);
        try {
            const api = await authApis();
            if (currentReview) {
                await api.patch(endpoints.reviews.detail(currentReview.id), {
                    rating,
                    comment
                });
            } else {
                await api.post(endpoints.recipes.reviews.list(recipeId), {
                    rating,
                    comment
                });
            }
            setIsSuccess(true);
        } catch (err) {

        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const api = await authApis();
                const res = await api.get(endpoints.recipes.reviews.myReview(recipeId));
                const data = res.data
                if (data) {
                    setRating(data.rating);
                    setComment(data.comment);
                    setCurrentReview(res.data);
                }
            } catch (err) {
            }
        }
        fetchData();
    }, [])
    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {isSuccess ? <div className="text-center p-4">
                        <BsCheckCircle size={64} color="green" className="mb-3" />

                        <h4 className="fw-bold">Đã đánh giá thành công</h4>
                        {/* <p className="text-muted">
                            Chúng tôi đã nhận được báo cáo của bạn. Nội dung này sẽ được xem xét để đảm bảo cộng đồng luôn an toàn và tích cực.
                        </p> */}
                    </div> : <>
                        <div className="d-flex justify-content-center mb-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    size={32}
                                    className="me-1 cursor-pointer"
                                    color={star <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(0)}
                                />
                            ))}
                        </div>

                        <Form.Group>
                            <Form.Label>Bình luận</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Viết bình luận của bạn..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </>}


                </Modal.Body>
                <Modal.Footer>
                    {isSuccess ? <Button variant="success" onClick={() => setShowModal(false)}>
                        Ok
                    </Button> : <Button variant="danger" onClick={handleSubmit} disabled={rating === 0}>
                        Báo cáo
                    </Button>}
                    {/* <button className="btn btn-success" onClick={handleSubmit} disabled={rating === 0}>
                        Gửi đánh giá
                    </button> */}
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default RecipeReviewInputDialog;