import React, { useState } from 'react';
import moment from 'moment';
import 'moment/locale/vi';
import ReportDialog from '../../../../../dialogs/ReportDialog';
import { HiOutlineFlag } from 'react-icons/hi';
const ChildComment = ({ commentId, avatar, name, date, content }) => {
  const formattedDate = moment(date).fromNow();
  const [showReportModal, setShowReportModal] = useState(false);
  return (
    <>
      <div className="d-flex align-items-start gap-3 p-3 border-bottom">
        <img
          src={avatar}
          alt="Avatar"
          className="rounded-circle"
          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
        />
        <div>
          <div className="bg-light rounded p-2 mb-3">
            <div className='d-flex flex-row align-items-center'>
              <p className="fw-semibold">{name}</p>
              <p className="text-muted d-block ms-3">{formattedDate}</p>
            </div>
            <p className="mb-0">{content}</p>
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

      </div>
    </>
  );
};

export default ChildComment;