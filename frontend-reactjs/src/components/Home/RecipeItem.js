import "./RecipeItem.css";
import { BiDotsHorizontalRounded, BiShareAlt } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { slugify } from "../../utils/Common";
import { useState } from "react";
import ReportDialog from "../../dialogs/ReportDialog";

const RecipeItem = ({ recipe }) => {
    const [showActionMenu, setShowActionMenu] = useState(false);
    const navigate = useNavigate();
    const [showReportModal, setShowReportModal] = useState(false);

    const downloadImage = async () => {
        const response = await fetch(recipe.image);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = slugify(recipe.title);
        link.click();

        URL.revokeObjectURL(url); // Dọn bộ nhớ
    };

    return (
        <div
            onClick={() => navigate(`/recipes/${recipe.id}-${slugify(recipe.title)}`)}
            className="card mb-4 recipe-card"
            style={{
                breakInside: "avoid",
                width: "100%",
                position: "relative",
                overflow: "hidden",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer", // để thấy như link
            }}
        >
            <div
                className="position-relative group"
                style={{ cursor: 'pointer' }}
            >
                {/* Hình ảnh món ăn */}
                <div className="recipe-image">
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="card-img-top"
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '40%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)',
                        }}
                    />
                </div>

                <div
                    className="text-center fs-5"
                    style={{
                        position: 'absolute',
                        bottom: '8px',
                        width: '100%',
                        color: 'white',
                        fontWeight: '600',
                        zIndex: 2,
                    }}
                >
                    {recipe.title}
                </div>

                {/* Nút xuất hiện khi hover */}
                <div
                    className="action-buttons d-flex justify-content-between align-items-start px-2"
                    style={{
                        position: 'absolute',
                        top: '10px',
                        width: '100%',
                        // height: '50px',
                        transition: 'opacity 0.3s',
                        zIndex: 3,
                    }}
                >
                    {/* <div className="hover-box">
                                Di chuột vào tôi 👆
                            </div> */}
                    <div
                        className="position-relative"
                        style={{ paddingBottom: '5px' }}
                        onMouseEnter={() => setShowActionMenu(true)}
                        onMouseLeave={() => setShowActionMenu(false)}
                    >
                        {/* Nút 3 chấm */}
                        <button
                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: '36px', height: '36px' }}
                        >
                            <BiDotsHorizontalRounded size={20} />
                        </button>

                        {/* Menu hành động */}
                        {showActionMenu && (
                            <div
                                className="position-absolute bg-white shadow-sm rounded px-2 py-1 d-flex flex-column gap-1 mt-1"
                                style={{
                                    top: 'calc(100% - 5px)',
                                    zIndex: 10,
                                    minWidth: '120px',
                                }}
                            >
                                {/* <button className="btn btn-light btn-sm text-start w-100" >
                                    🚩 Báo cáo
                                </button> */}
                                {/* <div onClick={(e) => e.stopPropagation()}>
                                    <ReportDialog recipeId={recipe.id} />
                                </div> */}

                                <>
                                    <button className="btn btn-light btn-sm text-start w-100"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowReportModal(true);
                                        }}
                                    >
                                        🚩 Báo cáo
                                    </button>
                                    <div onClick={(e) => e.stopPropagation()}>
                                        <ReportDialog objectId={recipe.id} showModal={showReportModal} 
                                        setShowModal={setShowReportModal} contentType={"recipe"}/>
                                    </div>
                                </>

                                <a href={recipe.image} download="ten_anh.jpg">
                                    <button onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation(); // Ngăn click lan lên thẻ Link
                                        downloadImage();     // Gọi hàm tải ảnh
                                    }} className="btn btn-light btn-sm text-start w-100">
                                        ⬇️ Tải xuống
                                    </button>
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="d-flex gap-2">
                        {/* Nút chia sẻ */}
                        <button
                            className="btn btn-light btn-sm rounded-circle d-flex align-items-center justify-content-center me-2"
                            style={{ width: '36px', height: '36px' }} // đảm bảo hình tròn cố định
                        >
                            <BiShareAlt />
                        </button>
                        {/* Nút lưu */}
                        <button className="btn btn-danger btn-sm fw-bold rounded-pill px-3">
                            Lưu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RecipeItem;