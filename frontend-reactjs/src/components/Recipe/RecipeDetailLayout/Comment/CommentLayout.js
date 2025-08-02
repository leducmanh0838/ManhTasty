import React, { useContext, useEffect, useState } from 'react';
import Apis, { authApis, endpoints } from '../../../../configs/Apis';
import CommentInput from "./CommentInput";
import CommentList from "./CommentList";
import { AppContext } from '../../../../provides/AppProvider';
import { toast } from 'react-toastify';

const CommentLayout = ({ recipeId }) => {
    const [comments, setComments] = useState([]);
    const { currentUser } = useContext(AppContext);

    const handleAddComment = async (newCommentText) => {
        if (!currentUser) {
            toast.warning("Bạn cần ĐĂNG NHẬP để bình luận!");
            return;
        }
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
                let api;
                if (currentUser)
                    api = await authApis();
                else
                    api = Apis;
                // 1. Gọi API recipe
                const resComments = await api.get(endpoints.recipes.comments(recipeId));
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
            <CommentList comments={comments} recipeId={recipeId} />
        </>
    )
}

export default CommentLayout;