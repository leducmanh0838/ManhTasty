import ChildComment from "./ChildComment";

const ChildCommentList = ({ comments }) => {
    return (
        <>
            {comments.map((comment) => (
                <ChildComment
                    commentId={comment.id}
                    avatar={comment.user.avatar}
                    name={`${comment.user.first_name} ${comment.user.last_name}`}
                    date={comment.created_at}
                    content={comment.content}
                    // replyCount={comment.reply_count}
                />
            ))}
        </>
    );
};

export default ChildCommentList;