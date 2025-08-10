
import Avatar from '../../../components/ui/Avatar';
import moment from 'moment';
import 'moment/locale/vi';
import GridReactionSimpleList from '../../reactions/components/GridReactionSimpleList';
import { FaRegComment } from 'react-icons/fa';
import MenuItemWithIcon from '../../../components/ui/MenuItemWithIcon';
import ReactionPickerButton from '../../reactions/components/ReactionPickerButton';
import { useContext, useState } from 'react';
import ReportDialogButton from '../../reports/components/ReportDialogButton';
import CommentInput from './CommentInput';
import { AppContext } from '../../../provides/AppProvider';
import { toast } from 'react-toastify';
import Apis, { authApis, endpoints } from '../../../configs/Apis';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';

const CommentItem = ({ comment, recipeId, parent }) => {
    console.info("render CommentItem ", Math.random())
    const { currentUser } = useContext(AppContext);

    const [emotions, setEmotions] = useState(comment.emotion_counts?comment.emotion_counts:{});
    const [selectedEmotion, setSelectedEmotion] = useState(comment.current_emotion);

    const [showInputReply, setShowInputReply] = useState(false);
    const [replyPage, setReplyPage] = useState({
        "count": 0,
        "next": null,
        "previous": null,
        "results": []
    });
    const [showReplies, setShowReplies] = useState(false);
    const [localReplyCount, setLocalReplyCount] = useState(comment.reply_count?comment.reply_count:0);
    // const [replies, setReplies] = useState([]);

    const fetchChildCommentList = async () => {
        try {
            let response = await Apis.get(endpoints.comments.replies(comment.id));
            setReplyPage(response.data)
        } catch (error) {
            console.error("Login error:", error.response || error.message);
        }
    }

    const hanldeShowReplies = async () => {
        setShowReplies(prev => !prev);
        if (replyPage.results.length === 0) {
            await fetchChildCommentList();
        }
    }

    const handleAddReply = async (content) => {
        if (!currentUser) {
            toast.warning("Bạn cần ĐĂNG NHẬP để bình luận!");
            return;
        }
        try {
            const api = await authApis();

            let response = await api.post(
                endpoints.recipes.comments(recipeId),
                {
                    content,
                    parent: comment.id
                    // "parent": "1"
                }
            );

            // setCommentPage([response.data, ...commentPage]);
            setReplyPage(prev => ({
                ...prev, // giữ nguyên count, next, previous
                count: prev.count + 1, // tăng số lượng comment
                results: [response.data, ...prev.results] // thêm comment mới lên đầu
            }));
            setLocalReplyCount(prev => prev + 1)

        } catch (error) {
            console.error("Login error:", error.response || error.message);
        }
    };

    return (
        <>
            {comment && <div className="d-flex align-items-start gap-3 p-3 border-bottom">
                <Avatar src={comment.user.avatar} size={40} />
                <div>
                    <div className="bg-light rounded p-3 d-inline-block border">
                        <div className='d-flex flex-row align-items-center'>
                            <p className="fw-semibold">{`${comment.user.first_name} ${comment.user.last_name}`}</p>
                            <p className="text-muted d-block ms-3">{moment(comment.created_at).fromNow()}</p>
                        </div>
                        <p className="mb-0">{comment.content}</p>
                    </div>
                    <div className="my-1">
                        <GridReactionSimpleList emotions={emotions} />
                    </div>

                    <div className='d-flex flex-row align-items-center p-1'>
                        {/* Phản hồi */}
                        {parent && <>
                            <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2 border"
                                onClick={() => setShowInputReply(prev => !prev)}
                            >
                                <MenuItemWithIcon icon={<FaRegComment />} label={"Phản hồi"} />
                            </button>

                            {/* Cảm xúc */}
                            <ReactionPickerButton {...{ emotions, setEmotions, selectedEmotion, setSelectedEmotion, objectId: comment.id, contentType: "comment" }} />
                        </>}

                        {/* Báo cáo */}
                        {/* <ReportDialogButton objectId={comment.id} contentType={"comment"}/> */}
                        <ReportDialogButton objectId={comment.id} contentType={"comment"} className={"rounded-pill gap-1 px-3 py-1 me-2 border"} />
                    </div>
                    {parent && <>
                        {showInputReply && <CommentInput onSubmit={handleAddReply} />}

                        {localReplyCount > 0 && (
                            <button
                                className="btn btn-sm d-inline-flex align-items-center gap-1 text-primary bg-light border-0 rounded-pill px-2 py-1 my-2"
                                style={{ backgroundColor: '#e6f0ff' }} // màu nền giống YouTube
                                onClick={hanldeShowReplies}
                            >
                                {showReplies ? <HiChevronDown size={20} /> : <HiChevronUp size={20} />} {localReplyCount} phản hồi
                            </button>
                        )}

                        {showReplies && (
                            <CommentItemList comments={replyPage.results} recipeId={recipeId} />
                            // <ChildCommentList comments={replies} />
                        )}
                    </>}

                </div>
            </div>}

        </>
    )
}

const CommentItemList = ({ comments, recipeId, parent = false }) => {
    console.info("render CommentItemList ", Math.random())
    return (
        <>
            {comments.map((comment) => (
                <CommentItem key={comment.id}
                    recipeId={recipeId}
                    comment={comment}
                    parent={parent}
                />
            ))}
        </>
    );
};

export default CommentItemList;