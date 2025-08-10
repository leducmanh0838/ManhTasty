import { useNavigate } from "react-router-dom";

const IngredientItemList = ({ ingredients }) => {
    const navigate = useNavigate();
    return (
        <div className="list-group">
            {ingredients.map((item, index) => (
                <div key={index} className="list-group-item d-flex align-items-center">
                    <span className="fw-bold text-danger me-2">
                        {item.quantity} {item.unit}
                    </span>
                    <span className="btn btn-light" onClick={()=>navigate(`/search?keyword=${item.name}`)}>{item.name}</span>
                </div>
            ))}
        </div>
    );
};

export default IngredientItemList;