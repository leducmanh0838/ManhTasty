// import EmotionChip from "./EmotionChip";

import { EmotionType } from "../../configs/Types";
import EmotionItem from "./EmotionItem";

const EmotionList = ({ emotions }) => {
  console.info("emotions", emotions)
  return (
    <div className="d-flex flex-wrap">
      {/* {emotions.map((item, index) => (
        <EmotionChip key={index} icon={item.icon} count={item.count} />
      ))} */}
      {Object.entries(emotions).map(([key, count]) => {
        if (count <= 0) return null; // bỏ qua những emotion không có lượt
        return (
          <EmotionItem keyEmotion={key} count={count} />
        );
      })}
    </div>
  );
};

export default EmotionList;