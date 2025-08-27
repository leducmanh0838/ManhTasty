import { useEffect, useState } from "react";
import CommentItemList, { CommentItem } from "../components/CommentItemList";
import { printErrors } from "../../../utils/printErrors";
import Apis, { endpoints } from "../../../configs/Apis";
import { useParams } from "react-router-dom";

const CommentPage = ({ }) => {
    const { commentId } = useParams();

    const [comment, setComment] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Apis.get(endpoints.comments.detail(commentId));
                console.info("res.data: ", res.data)
                setComment(res.data);
            } catch (err) {
                printErrors(err);
            }
        }
        fetchData();
    }, [])

    return (
        <>
            <div className="p-3">
                <h2 className="fw-bold mb-3">
                    Bình luận
                </h2>
                {comment && <CommentItem recipeId={0} comment={comment} />}
            </div>
        </>
    )
}

export default CommentPage;