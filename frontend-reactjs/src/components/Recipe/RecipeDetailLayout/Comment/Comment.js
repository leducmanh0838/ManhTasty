import React, { useContext, useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { HiChevronDown, HiChevronUp, HiOutlineFlag, HiOutlineThumbUp } from 'react-icons/hi';
import Apis, { authApis, endpoints } from '../../../../configs/Apis';
import ChildCommentList from './ChildComment/ChildCommentList';
import { FaRegComment } from 'react-icons/fa';
import CommentInput from './CommentInput';
import { EmotionType, emotionTypes } from '../../../../configs/Types';
import EmotionList from '../../../Emotion/EmotionList';
import { toast } from 'react-toastify';
import { AppContext } from '../../../../provides/AppProvider';
import ReportDialog from '../../../../dialogs/ReportDialog';
const Comment = ({ recipeId, commentId, avatar, name, date, content, replyCount = 0, emotionCounts = {}, currentEmotion = {} }) => {
  const [replies, setReplies] = useState([]);
  const formattedDate = moment(date).fromNow();
  const [showReplies, setShowReplies] = useState(false);
  const [showInputReply, setShowInputReply] = useState(false);
  const [localReplyCount, setLocalReplyCount] = useState(replyCount);
  const [selectedEmotion, setSelectedEmotion] = useState(currentEmotion);
  const [emotions, setEmotions] = useState(emotionCounts);
  const [showEmotionMenu, setShowEmotionMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const { currentUser } = useContext(AppContext);

  const fetchChildCommentList = async () => {
    try {
      let response = await Apis.get(endpoints.comments.replies(commentId));
      setReplies(response.data.results)
    } catch (error) {
      console.error("Login error:", error.response || error.message);
    }
  }

  const handleAddReply = async (newCommentText) => {
    if (!currentUser) {
      toast.warning("Bạn cần ĐĂNG NHẬP để bình luận!");
      return;
    }
    try {
      const api = await authApis();
      let response = await api.post(
        endpoints.recipes.comments(recipeId),
        {
          "content": newCommentText,
          "parent": commentId
        }
      );

      setReplies([response.data, ...replies]);
      setLocalReplyCount(prev => prev + 1)

    } catch (error) {
      console.error("Login error:", error.response || error.message);
    }
  };

  const hanldeShowReplies = async () => {
    setShowReplies(prev => !prev);
    if (replies.length === 0) {
      await fetchChildCommentList();
    }
  }

  const handleDeleteCurrentEmotion = async () => {
    try {
      const api = await authApis();
      const reactionId = selectedEmotion.id

      let response = await api.delete(
        endpoints.reactions.reactionDetail(reactionId)
      );

      const oldEmotionType = selectedEmotion.emotion.toString();
      setEmotions(prev => ({
        ...prev,
        [oldEmotionType]: prev[oldEmotionType] - 1
      }));
      setSelectedEmotion({})
    } catch (error) {

      // setSubmitSuccess(false);

      // if (error.response && error.response.data && error.response.data.message) {
      //     setSubmitError(error.response.data.message);
      // } else {
      //     setSubmitError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
      // }

      console.error("Login error:", error.response || error.message);
    }
  }

  const handleGiveEmotion = async (emotionType) => {
    if (!currentUser) {
      toast.warning("Bạn cần ĐĂNG NHẬP để thả cảm xúc!!");
      return;
    }
    try {
      const api = await authApis();

      let response = await api.post(
        endpoints.reactions.reactions,
        {
          object_id: commentId,
          content_type: "comment",
          emotion: emotionType
        }
      );

      if (selectedEmotion && selectedEmotion.emotion) {
        const oldEmotionType = selectedEmotion.emotion.toString();
        setEmotions(prev => ({
          ...prev,
          [oldEmotionType]: prev[oldEmotionType] - 1
        }));
      }

      setSelectedEmotion(response.data)

      const newEmotionType = response.data.emotion.toString();
      setEmotions(prev => ({
        ...prev,
        [newEmotionType]: prev[newEmotionType] ? prev[newEmotionType] + 1 : 1
      }));

    } catch (error) {

      // setSubmitSuccess(false);

      // if (error.response && error.response.data && error.response.data.message) {
      //     setSubmitError(error.response.data.message);
      // } else {
      //     setSubmitError("Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.");
      // }

      console.error("Login error:", error.response || error.message);
    }
  }

  return (
    <div className="d-flex align-items-start gap-3 p-3 border-bottom">
      <img
        src={avatar}
        alt="Avatar"
        className="rounded-circle"
        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
      />
      <div>
        <div className="bg-light rounded p-3 d-inline-block">
          <div className='d-flex flex-row align-items-center'>
            <p className="fw-semibold">{name}</p>
            <p className="text-muted d-block ms-3">{formattedDate}</p>
          </div>
          <p className="mb-0">{content}</p>
        </div>
        <div className="my-1">
          <EmotionList emotions={emotions} />
        </div>

        <div className='d-flex flex-row align-items-center p-1'>
          {/* <p className="text-muted d-block ms-3">Thích</p> */}
          <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2"
            onClick={() => setShowInputReply(prev => !prev)}>
            <span><FaRegComment /></span> <span>Phản hồi</span>
          </button>

          <div
            className="position-relative d-inline-block"
            onMouseEnter={() => setShowEmotionMenu(true)}
            onMouseLeave={() => setShowEmotionMenu(false)}
          >
            <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1">
              {selectedEmotion && selectedEmotion.emotion ? <div onClick={handleDeleteCurrentEmotion}>
                <span>{EmotionType.getIcon(selectedEmotion.emotion)}</span> <span>{EmotionType.getLabel(selectedEmotion.emotion)}</span>
              </div> : <>
                <span><HiOutlineThumbUp /></span> <span>Thích</span>
              </>}
            </button>

            {showEmotionMenu && (
              <div
                className="position-absolute bg-white shadow-sm rounded-pill px-2 py-1 d-flex gap-2 mt-1"
                style={{
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  zIndex: 10,
                }}
              >
                {emotionTypes.map((e) => (
                  <button
                    key={e.id}
                    className="btn btn-sm bg-white border-0 fs-4"
                    onClick={() => {
                      // setSelectedEmotion(e.id);
                      setShowEmotionMenu(false);
                      handleGiveEmotion(e.id);
                    }}
                    title={e.label}
                  >
                    {e.icon}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2"
              onClick={() => {
                setShowReportModal(true);
              }}>
              <span><HiOutlineFlag /></span> <span>Báo cáo vi phạm</span>
            </button>
            <ReportDialog objectId={commentId} showModal={showReportModal} setShowModal={setShowReportModal} contentType={"comment"} />
          </div>

        </div>
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
          <ChildCommentList comments={replies} />
        )}
      </div>
    </div>
  );
};

export default Comment;