import React, { memo, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../../provides/AppProvider';
import CommentInput from './CommentInput';
import Apis, { authApis, endpoints } from '../../../configs/Apis';
import CommentItemList from './CommentItemList';

const CommentSection = ({ recipeId }) => {
    console.info("render CommentSection ", Math.random())
    const [commentPage, setCommentPage] = useState({});
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

            // setCommentPage([response.data, ...commentPage]);
            setCommentPage(prev => ({
                ...prev, // giữ nguyên count, next, previous
                count: prev.count + 1, // tăng số lượng comment
                results: [response.data, ...prev.results] // thêm comment mới lên đầu
            }));

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
                setCommentPage(resComments.data);
            } catch (err) {
                console.error("Lỗi khi load dữ liệu:", err);
            }
        };

        fetchData();
    }, []);
    return (
        <>
            <CommentInput onSubmit={handleAddComment} />
            {commentPage && commentPage.results && 
            <CommentItemList comments={commentPage.results} recipeId={recipeId} parent={true}/>}
        </>
    )
}

export default memo(CommentSection);