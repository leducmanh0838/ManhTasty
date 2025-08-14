import { memo, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';
import { AppContext } from '../../../provides/AppProvider';
import CommentInput from './CommentInput';
import  { authApis, endpoints } from '../../../configs/Apis';
import CommentItemList from './CommentItemList';
import usePagination from '../../../hooks/usePagination';

const CommentSection = ({ recipeId }) => {
    console.info("render CommentSection ", Math.random())

    const {
        resultData: comments,
        setResultData: setComments,
        loading,
        loadMore,
        refresh,
        hasMore,
        page,
    } = usePagination({ endpoint: endpoints.recipes.comments(recipeId), isLoadFirstData: true });
    const { currentUser } = useContext(AppContext);

    useEffect(() => {
        console.info("comments: ", JSON.stringify(comments, null, 2));
    }, [comments])

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
            setComments(prev => [response.data, ...prev])
            // setCommentPage(prev => ({
            //     ...prev, // giữ nguyên count, next, previous
            //     count: prev.count + 1, // tăng số lượng comment
            //     results: [response.data, ...prev.results] // thêm comment mới lên đầu
            // }));

        } catch (error) {
            console.error("Login error:", error.response || error.message);
        }
    };

    return (
        <>
            <CommentInput onSubmit={handleAddComment} />
            {comments && <CommentItemList isLoadingMore={loading} loadMore={loadMore} 
            comments={comments} recipeId={recipeId} parent={true} 
            hasMoreComments = {hasMore}/>}
        </>
    )
}

export default memo(CommentSection);