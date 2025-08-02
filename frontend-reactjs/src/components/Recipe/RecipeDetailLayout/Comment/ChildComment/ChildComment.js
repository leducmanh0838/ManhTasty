import React from 'react';
import moment from 'moment';
import 'moment/locale/vi';
const ChildComment = ({ avatar, name, date, content}) => {
  const formattedDate = moment(date).fromNow();
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
      </div>
    </div>
  );
};

export default ChildComment;