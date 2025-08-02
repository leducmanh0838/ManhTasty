
import Comment from './Comment';

const CommentList = ({ comments }) => {
    // const [comments, setComment] = useState([]);
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             // 1. Gọi API recipe
    //             const resComments = await Apis.get(endpoints.recipes.comments(recipeId));
    //             setComment(resComments.data.results);
    //         } catch (err) {
    //             console.error("Lỗi khi load dữ liệu:", err);
    //         }
    //     };

    //     fetchData();
    // }, []);
    return (
        <>
            {comments.map((comment) => (
                <Comment
                    commentId={comment.id}
                    avatar={comment.user.avatar}
                    name={`${comment.user.first_name} ${comment.user.last_name}`}
                    date={comment.created_at}
                    content={comment.content}
                    replyCount={comment.reply_count}
                />
            ))}
        </>
    );
};

export default CommentList;