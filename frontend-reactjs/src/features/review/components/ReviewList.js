import { useEffect, useState } from "react";
import moment from 'moment';
import 'moment/locale/vi';
import Avatar from "../../../components/ui/Avatar";
import AvgRating from "../../../components/ui/AvgRating";
import Apis, { endpoints } from "../../../configs/Apis";
import { printErrors } from "../../../utils/printErrors"
import usePagination from "../../../hooks/usePagination";
import LoadingSpinner from "../../../components/ui/Spinner/LoadingSpinner";
import { FiCornerDownRight } from "react-icons/fi";

const ReviewItem = ({ review }) => {
    return (
        <>
            {review && <div className="d-flex align-items-start gap-3 p-3 border-bottom">
                <Avatar src={review.user.avatar} size={40} />
                <div>
                    <div className="bg-light rounded p-3 d-inline-block border">
                        <div className='d-flex flex-row align-items-center'>
                            <p className="fw-semibold mb-1">{`${review.user.first_name} ${review.user.last_name}`}</p>
                            <p className="text-muted d-block ms-3 mb-1">{moment(review.created_at).fromNow()}</p>
                        </div>
                        <div className="mb-1">
                            <AvgRating average={review.rating} />
                        </div>
                        <p className="mb-0">{review.comment}</p>
                    </div>
                </div>
            </div>}
        </>
    )
}

const ReviewList = ({ recipeId }) => {
    const {
        resultData: reviews,
        loadMore,
        refresh,
        hasMore,
        loading,
    } = usePagination({ endpoint: endpoints.recipes.reviews.list(recipeId), isLoadFirstData: true });
    return (
        <>
            {reviews && reviews.map((review) => (
                <ReviewItem review={review}
                />
            ))}
            {hasMore && <>
                {loading ? <LoadingSpinner size='sm' text='Đang tải bình luận...' /> : <button
                    onClick={loadMore}
                    className="btn btn-light-blue text-primary py-1 px-3 d-flex align-items-center text-decoration-none text-primary"
                    style={{ gap: "5px" }}
                >
                    <FiCornerDownRight size={18} />
                    Hiện thêm phản hồi
                </button>}
            </>
            }
        </>
    )
}

export default ReviewList;