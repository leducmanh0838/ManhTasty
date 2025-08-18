import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import AvgRating from "../../../components/ui/AvgRating";
import Apis, { endpoints } from "../../../configs/Apis";

const ReviewStats = ({ recipeId }) => {
  const [stats, setStats] = useState({
    // "1": 2,
    // "2": 5,
    // "3": 2,
    // "4": 4,
    // "5": 5
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Apis.get(endpoints.recipes.reviews.stats(recipeId));
        setStats(res.data);
      } catch (err) {

      }
    }
    fetchData();
  }, [])

  const total = Object.values(stats).reduce((a, b) => a + b, 0);
  const average =
    total > 0
      ? (
        Object.entries(stats).reduce(
          (sum, [star, count]) => sum + Number(star) * count,
          0
        ) / total
      ).toFixed(1)
      : 0;

  return (
    <div className="p-3 bg-white rounded shadow d-flex">
      {/* Cột trái: điểm trung bình */}
      <div className="text-center me-4" style={{ width: "100px" }}>
        <h1 className="display-5 fw-bold">{average}</h1>
        <div className="d-flex justify-content-center mb-1">
          <AvgRating average={average} />
        </div>
        <div className="text-muted small">{total} đánh giá</div>
      </div>

      {/* Cột phải: chi tiết từng sao */}
      <div className="flex-grow-1">
        {Object.keys(stats)
          .sort((a, b) => b - a)
          .map((star) => {
            const count = stats[star];
            const percent = total ? (count / total) * 100 : 0;

            return (
              <div key={star} className="d-flex align-items-center mb-2">
                <span className="me-2 small" style={{ width: "30px" }}>
                  {star}
                  <FaStar className="ms-1 text-warning" size={12} />
                </span>

                <div className="progress flex-grow-1 me-2" style={{ height: "8px" }}>
                  <div
                    className="progress-bar bg-warning"
                    role="progressbar"
                    style={{ width: `${percent}%` }}
                    aria-valuenow={percent}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <span className="small text-muted">{count}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default ReviewStats;