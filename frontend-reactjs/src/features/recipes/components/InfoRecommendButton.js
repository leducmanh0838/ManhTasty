import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaInfoCircle } from "react-icons/fa";

const InfoRecommendButton = ({recipeRecommends}) => {
    return (
        <OverlayTrigger
            placement="right"
            overlay={
                <Tooltip id="tooltip-info" style={{ maxWidth: '500px' }}> {/* giới hạn width nếu muốn */}
                    {recipeRecommends.map((r) => (
                        <div
                            key={r.id}
                            style={{
                                marginBottom: '8px',
                                borderBottom: '1px solid #ccc',
                                paddingBottom: '4px'
                            }}
                        >
                            <img
                                src={r.image}
                                alt={r.title}
                                style={{ width: '50px', height: '50px', objectFit: 'cover', marginBottom: '4px' }}
                            />
                            <div><strong>{r.title}</strong></div>
                            <div>Số nguyên liệu trùng: {r.ingredient_score}</div>
                            <div>Số tag trùng: {r.tag_score}</div>
                            <div>Điểm gợi ý: {r.total_score}</div>
                        </div>
                    ))}
                </Tooltip>
            }
        >
            <button className="btn btn-light ms-2 p-0">
                <FaInfoCircle />
            </button>
        </OverlayTrigger>
    )
}

export default InfoRecommendButton;