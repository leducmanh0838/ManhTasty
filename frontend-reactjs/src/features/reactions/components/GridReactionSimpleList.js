import { memo } from "react";
import { EmotionTypeList } from "../constrants/emotionType";

const GridReactionSimple = ({ icon, count }) => (
    <span className="d-flex align-items-center px-3 py-1 bg-light rounded-pill shadow-sm border m-1">
        <span className="me-1">{icon}</span>
        <span>{count}</span>
    </span>
);

const GridReactionSimpleList = ({ emotions }) => {

    const list = EmotionTypeList
        .map(emotion => ({
            ...emotion,
            count: emotions?.[emotion.value] || 0
        }))
        .filter(item => item.count > 0); // Chỉ lấy những cái > 0

    if (list.length === 0) return null; // Không có cảm xúc nào thì bỏ qua

    return (
        <div className="d-flex flex-wrap">
            {list.map((item, index) => (
                <GridReactionSimple key={index} icon={item.icon} count={item.count} />
            ))}
        </div>
    );
}

export default memo(GridReactionSimpleList);