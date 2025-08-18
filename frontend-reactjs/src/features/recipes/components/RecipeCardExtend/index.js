import { useNavigate } from "react-router-dom";
import slugify from "../../../../utils/string/slugify"
import { BiTime } from "react-icons/bi";
import { BsPeople, BsSkipStart } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { FaStar } from "react-icons/fa";

const RecipeCardExtend = ({ recipe }) => {
    const navigate = useNavigate();

    return (
        <div className="btn btn-light p-0 border-0 card mb-3 shadow-sm w-100"
            style={{ overflow: "auto" }}
            onClick={() => navigate(`/recipes/${recipe.id}-${slugify(recipe.title)}`)}>
            <div className="d-flex">
                <img
                    src={recipe.image}
                    className="img-fluid rounded-start"
                    alt="Ảnh"
                    style={{
                        height: "300px",
                        width: "300px",
                        objectFit: "cover"
                    }}
                />
                <div>
                    <div className="card-body p-3">
                        {/* Tiêu đề + Bookmark */}
                        <div className="d-flex justify-content-between align-items-start">
                            <h2 className="card-title mb-1">{recipe.title}</h2>
                        </div>

                        {/* Nguyên liệu */}
                        <p className="card-text text-muted mb-1 fs-4 text-start">
                            {recipe.ingredients.map(i => i.name).join(", ")}
                        </p>

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

                        {/* Thời gian + Số người */}
                        <div className="d-flex text-muted mb-2">
                            {recipe.cooking_time && <div className="me-3"><BiTime /> {recipe.cooking_time} phút</div>}
                            {recipe.servings && <div className="me-3"><BsPeople /> {recipe.servings} người</div>}
                        </div>

                        <div className="d-flex text-muted mb-2">
                            <div><IoEyeSharp /> {recipe.view_count} lượt xem</div>
                        </div>
                        <div className="d-flex text-muted mb-2">
                            {recipe.rating_count ?
                                <div><FaStar color="orange" /> {(recipe.rating_sum / recipe.rating_count).toFixed(1)} sao</div> : 
                                <div>
                                    Chưa đánh giá
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecipeCardExtend;