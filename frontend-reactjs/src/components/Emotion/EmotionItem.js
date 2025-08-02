import { EmotionType } from "../../configs/Types";

const EmotionItem = ({ keyEmotion, count }) => {
    // console.info('key: ', key)
    return (
        <div key={keyEmotion} className="d-flex align-items-center px-3 py-1 bg-light rounded-pill shadow-sm">
            {EmotionType.getIcon(Number(keyEmotion))}
            <span className="ms-1 fw-medium">{count}</span>
        </div>
    );
};

export default EmotionItem;