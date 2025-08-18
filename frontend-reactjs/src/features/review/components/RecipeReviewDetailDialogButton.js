import { BiStar } from "react-icons/bi";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import RecipeReviewDetailDialog from "./RecipeReviewDetailDialog";
import { useState } from "react";
import AvgRating from "../../../components/ui/AvgRating";

const RecipeReviewDetailDialogButton = ({ className, avgStar, recipeId }) => {
    const [showModal, setShowModal] = useState(false);
    return (
        <>
            {avgStar ? <>
                <button className={`btn btn-light d-flex align-items-center btn-sm text-start ${className}`}
                    onClick={() => {
                        setShowModal(true);
                    }}
                >
                    <span className="me-2">{avgStar}</span> <AvgRating average={avgStar} />
                </button>
                <RecipeReviewDetailDialog {...{ showModal, setShowModal, recipeId }} />
            </> : <>
                <div className={`d-flex align-items-center btn-sm text-start ${className}`}
                >
                    <span className="me-2">Chưa có đánh giá</span>
                </div>
            </>}
        </>
    )
}

export default RecipeReviewDetailDialogButton;