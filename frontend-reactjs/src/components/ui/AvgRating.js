import { FaStar } from "react-icons/fa";

const AvgRating = ({ average }) => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, i) => (
        <FaStar
          key={i}
          className={i < Math.round(average) ? "text-warning" : "text-secondary"}
        />
      ))}
    </>
  );
}

export default AvgRating;