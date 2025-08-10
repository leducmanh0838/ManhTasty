import { FaPlay } from "react-icons/fa";
import { MediaType } from "../../../medias/constants/mediaType";

const RecipeGalleryItem = ({ media }) => {
    return (
        <>
            {
                media.type !== MediaType.VIDEO.value ? (
                    <img
                        src={media.src}
                        alt={`Thumbnail`}
                        style={{
                            height: "100%",
                            width: "auto",
                            objectFit: "contain",
                            borderRadius: "8px",
                        }}
                    />
                ) : (
                    <div style={{ position: "relative", height: "100%", display: "inline-block" }}>
                        <video
                            src={media.src}
                            muted
                            style={{
                                height: "100%",
                                width: "auto",
                                objectFit: "contain",
                                display: "block",
                                borderRadius: "8px",
                            }}
                        />
                        {/* Mũi tên hướng phải */}
                        <div
                            style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                background: "rgba(0, 0, 0, 0.6)",
                                borderRadius: "50%",
                                padding: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <FaPlay color="white" size={20} />
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default RecipeGalleryItem;