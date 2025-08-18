import { useContext, useState } from "react";
import RecipeReviewInputDialog from "./RecipeReviewInputDialog";
import { AppContext } from "../../../provides/AppProvider";
import { toast } from "react-toastify";

const RecipeReviewInputDialogButton = ({ className, recipeId }) => {
    const [showModal, setShowModal] = useState(false);
    const { currentUser } = useContext(AppContext);
    return (
        <>
            <button className={`btn btn-light d-flex align-items-center btn-sm text-start ${className}`}
                onClick={() => {currentUser ? setShowModal(true):toast.warning("Bạn cần đăng nhập để đánh giá!");}}
            >
                Đánh giá
            </button>
            <RecipeReviewInputDialog {...{ showModal, setShowModal, recipeId }} />
        </>
    )
}

export default RecipeReviewInputDialogButton;