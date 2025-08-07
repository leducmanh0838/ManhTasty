import { useNavigate } from "react-router-dom";
import GridTagList from "../Recipe/RecipeDetailLayout/GridTagList";
import { slugify } from "../../utils/Common";

const RecipeItemType2 = ({ recipe }) => {
  const navigate = useNavigate();

  return (
    <div className="btn btn-light p-0 border-0 card mb-3 shadow-sm w-100"
      onClick={()=>navigate(`/recipes/${recipe.id}-${slugify(recipe.title)}`)}>
      <div className="row g-0">
        {/* Ảnh món ăn */}
        <div className="col-md-3">
          <img
            src={recipe.image}
            className="img-fluid rounded-start"
            alt="Ảnh"
          />
        </div>

        {/* Nội dung */}
        <div className="col-md-9">
          <div className="card-body p-3">
            {/* Tiêu đề + Bookmark */}
            <div className="d-flex justify-content-between align-items-start">
              <h2 className="card-title mb-1">{recipe.title}</h2>
              <i className="bi bi-bookmark"></i> {/* Bootstrap Icons nếu có */}
            </div>

            {/* Nguyên liệu */}
            <p className="card-text text-muted mb-1 fs-4 text-start">
              {recipe.ingredients.map(i => i.name).join(", ")}
            </p>

            {/* Thời gian + Số người */}
            {/* <div className="d-flex text-muted mb-2" style={{ fontSize: "0.85rem" }}>
              <div className="me-3">🕒 20p</div>
              <div>👥 2 người</div>
            </div> */}

            {/* Người đăng */}
            {/* <div className="d-flex align-items-center" style={{ fontSize: "0.9rem" }}>
              <img
                src={recipe.image}
                alt="avatar"
                className="rounded-circle me-2"
                style={{ width: "24px", height: "24px" }}
              />
              <span>Sơn Panda 🐱</span>
            </div> */}
            <div className="d-flex flex-wrap gap-2 p-3">
              {recipe.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 rounded-pill border border-2">
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeItemType2;