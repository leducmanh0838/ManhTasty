import React, { useEffect, useState } from 'react';
import Apis, { authApis, endpoints } from '../../../../configs/Apis';
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";

const CommentLayout = ({ recipeId }) => {
    const [comments, setComments] = useState([]);

    const handleAddComment = async (newCommentText) => {
        try {
            const api = await authApis();

            let response = await api.post(
                endpoints.recipes.comments(recipeId),
                {
                    "content": newCommentText
                    // "parent": "1"
                }
            );

            setComments([response.data, ...comments]);

        } catch (error) {


            console.error("Login error:", error.response || error.message);
        }
    };


    // console.info('recipeId: ', recipeId)
    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Gọi API recipe
                const resComments = await Apis.get(endpoints.recipes.comments(recipeId));
                setComments(resComments.data.results);
                // console.info('resComments.data.results: ', resComments.data.results)
            } catch (err) {
                console.error("Lỗi khi load dữ liệu:", err);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <CommentInput onSubmit={handleAddComment} />
            <CommentList comments={comments} />
        </>
    )
}

export default CommentLayout;