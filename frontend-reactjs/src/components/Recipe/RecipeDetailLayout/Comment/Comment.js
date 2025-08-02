import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import { HiChevronDown, HiChevronUp, HiOutlineThumbUp } from 'react-icons/hi';
import Apis, { endpoints } from '../../../../configs/Apis';
import ChildCommentList from './ChildComment/ChildCommentList';
import { FaRegComment } from 'react-icons/fa';
import CommentInput from './CommentInput';
const Comment = ({ commentId, avatar, name, date, content, replyCount = 0 , emotionCounts, currentEmotion}) => {
  const [replies, setReplies] = useState([]);
  const formattedDate = moment(date).fromNow();
  const [showReplies, setShowReplies] = useState(false);

  const fetchChildCommentList = async () => {
    try {

      let response = await Apis.get(endpoints.comments.replies(commentId));
      setReplies(response.data.results)
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

  const hanldeShowReplies = async () => {
    setShowReplies(prev => !prev);
    if (replies.length === 0) {
      await fetchChildCommentList();
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
        <div className="bg-light rounded p-2">
          <div className='d-flex flex-row align-items-center'>
            <p className="fw-semibold">{name}</p>
            <p className="text-muted d-block ms-3">{formattedDate}</p>
          </div>
          <p className="mb-0">{content}</p>
        </div>
        <div className='d-flex flex-row align-items-center p-1'>
          {/* <p className="text-muted d-block ms-3">Thích</p> */}
          <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1 me-2">
              <span><FaRegComment /></span> <span>Phản hồi</span>
          </button>
          {/* <p className="text-muted d-block ms-3">Thích</p> */}
          <button className="btn btn-light rounded-pill d-flex align-items-center gap-1 px-3 py-1">
            {/* {selectedEmotion && selectedEmotion.emotion ? <div onClick={handleDeleteCurrentEmotion}>
              <span>{EmotionType.getIcon(selectedEmotion.emotion)}</span> <span>{EmotionType.getLabel(selectedEmotion.emotion)}</span>
            </div> : <> */}
              <span><HiOutlineThumbUp /></span> <span>Thích</span>
            {/* </>} */}
          </button>
        </div>
        <CommentInput/>

        {replyCount > 0 && (
          <button
            className="btn btn-sm d-inline-flex align-items-center gap-1 text-primary bg-light border-0 rounded-pill px-2 py-1 my-2"
            style={{ backgroundColor: '#e6f0ff' }} // màu nền giống YouTube
            onClick={hanldeShowReplies}
          >
            {showReplies ? <HiChevronDown size={20} /> : <HiChevronUp size={20} />} {replyCount} phản hồi
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