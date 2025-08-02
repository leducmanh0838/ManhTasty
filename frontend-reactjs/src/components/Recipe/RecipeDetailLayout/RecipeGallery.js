import React, { useRef, useState } from "react";
import "./RecipeGallery.css";
import { FaPlay } from "react-icons/fa";
import { MediaType } from "../../../configs/Types";

// const medias = [
//     { type: MediaType.IMAGE, src: "https://res.cloudinary.com/dedsaxk7j/image/upload/v1753441899/recipes/main_images/20250725181137_2d52b013.jpg" },
//     { type: MediaType.IMAGE, src: "https://res.cloudinary.com/dedsaxk7j/image/upload/v1753442215/steps/20250725181652_1f0a42bf.png", },
//     { type: MediaType.VIDEO, src: "https://res.cloudinary.com/dedsaxk7j/video/upload/v1753443251/recipes/medias/videos/20250725183408_86b9f1ef.mp4" },
//     { type: MediaType.GIF, src: "http://res.cloudinary.com/dedsaxk7j/image/upload/v1/recipes/medias/gifs/20250725182647_9e1e36d3" },
// ];

const RecipeGallery = ({medias}) => {

    const containerRef = useRef(null);
    const itemRefs = useRef([]);

    const scrollToCenter = (index) => {
        const container = containerRef.current;
        const item = itemRefs.current[index];

        if (container && item) {
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();

            const offset = itemRect.left - containerRect.left;
            const scroll = offset - (container.clientWidth / 2) + (item.clientWidth / 2);

            container.scrollBy({
                left: scroll,
                behavior: "smooth",
            });
        }
    };

    const [selectedMedia, setSelectedMedia] = useState(medias[0]);

    return (
        <div className="container my-4">
            {/* <h2 className="h4 fw-bold mb-4 text-center">Món ăn</h2> */}

            {/* Vùng hiển thị media lớn */}
            <div className="border rounded overflow-hidden mb-4 text-center">
                {selectedMedia.type !== MediaType.VIDEO ? (
                    <img
                        src={selectedMedia.src}
                        alt="Selected Dish"
                        className="img-fluid"
                        style={{ height: "400px", objectFit: "contain" }}
                    />
                ) : (
                    <video
                        src={selectedMedia.src}
                        controls
                        className="img-fluid"
                        style={{ height: "400px", objectFit: "contain" }}
                    />
                )}
            </div>

            {/* Thumbnails cuộn ngang */}
            <div className="thumbnail-scroll d-flex gap-2 px-2 scroll-container"
                ref={containerRef}
                style={{
                    overflowX: "auto",     // Cho phép cuộn ngang
                    overflowY: "hidden",   // Ẩn cuộn dọc
                }}
            >
                {medias.map((media, index) => (
                    <div
                        ref={(el) => (itemRefs.current[index] = el)}
                        onClick={() => {
                            scrollToCenter(index);
                            setSelectedMedia(media);
                        }
                        }
                        key={index}
                        // onClick={() => setSelectedMedia(media)}
                        style={{
                            height: "100px",
                            width: "auto",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            filter: selectedMedia && selectedMedia.src !== media.src ? "brightness(60%)" : "none",
                        }}
                        // className={`border rounded ${selectedMedia.src === media.src ? "border-primary" : "border-secondary"}`}
                        className="scroll-item"
                    >
                        {media.type !== MediaType.VIDEO ? (
                            <img
                                src={media.src}
                                alt={`Thumbnail ${index}`}
                                style={{
                                    height: "100%",
                                    width: "auto",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                }}
                            />
                        ) : (
                            // <video
                            //     src={media.src}
                            //     muted
                            //     style={{
                            //         height: "90%",
                            //         width: "auto",
                            //         objectFit: "contain",
                            //     }}
                            // />
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
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeGallery;
