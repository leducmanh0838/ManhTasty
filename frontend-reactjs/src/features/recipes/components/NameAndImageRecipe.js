import { useNavigate } from "react-router-dom";
import slugify from "../../../utils/string/slugify";

const NameAndImageRecipe = ({ recipe, width = "auto", height = "auto", className, extraCount, onClickExtraImage }) => {
    const nav = useNavigate();
    return (
        <div
            className={`position-relative group ${className}`}
            style={{
                overflow: "hidden",
                border: "none",
                borderRadius: "12px",
                cursor: "pointer", // để thấy như link
            }}
        >
            {extraCount ? <>
                <div className="recipe-image"
                    onClick={onClickExtraImage}
                    style={{ borderRadius: "12px" }}>
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="card-img-top"
                        style={{
                            width: width,
                            height: height,
                            display: 'block',
                        }}
                    />
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%',
                            background: 'rgba(0,0,0,0.4)',
                        }}
                    />
                    <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-white fw-bold fs-5">
                        <h1>
                            {`+ ${extraCount}`}
                        </h1>
                    </div>
                </div>
            </> :
                <>
                    {/* Hình ảnh món ăn */}
                    <div className="recipe-image"
                        onClick={() => nav(`/recipes/${recipe.id}-${slugify(recipe.title)}`)}
                        style={{ borderRadius: "12px" }}
                    >
                        <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="card-img-top"
                            style={{
                                width: width,
                                height: height,
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
                </>
            }
            {/* <div className="position-absolute"
                style={{
                    height:"100%",
                    width: '100%',
                    color: 'white',
                }}
            >
                +3
            </div> */}
        </div>
    )
}

export default NameAndImageRecipe;