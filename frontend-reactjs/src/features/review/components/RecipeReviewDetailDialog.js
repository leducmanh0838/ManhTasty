import { Modal, Button, Form } from "react-bootstrap";
import ReviewStats from "./ReviewStats"
import ReviewList from "./ReviewList"

const RecipeReviewDetailDialog = ({ showModal, setShowModal, recipeId }) => {

    return (
        <>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Đánh giá</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <ReviewStats recipeId = {recipeId}/>
                    <ReviewList recipeId = {recipeId}/>

                </Modal.Body>
                <Modal.Footer>

                </Modal.Footer>
            </Modal>
        </>
    );
};

export default RecipeReviewDetailDialog;
