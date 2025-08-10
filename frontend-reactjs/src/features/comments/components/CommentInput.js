import { memo, useState } from 'react';
import { FaRegSmile } from 'react-icons/fa';
import { BsSend } from 'react-icons/bs';

const CommentInput = ({ onSubmit }) => {
    console.info("render CommentInput ", Math.random())
    const [comment, setComment] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (comment.trim() === '') return;

        onSubmit(comment);
        setComment('');    // Reset ô input
    };

    return (
        <form onSubmit={handleSubmit} className="d-flex align-items-center gap-2 mt-3">
            <FaRegSmile size={20} color="#888" />
            <input
                type="text"
                className="form-control"
                placeholder="Viết bình luận..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
                <BsSend />
            </button>
        </form>
    );
};

export default memo(CommentInput);
