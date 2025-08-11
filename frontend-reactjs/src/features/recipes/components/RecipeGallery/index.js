import { useRef, useState } from "react";
import "./RecipeGallery.css";
import RecipeGalleryItem from "../RecipeGalleryItem";
import MediaView from "../../../medias/components/MediaView";

const RecipeGallery = ({medias}) => {

    // const containerRef = useRef(null);
    // const itemRefs = useRef([]);

    // const scrollToCenter = (index) => {
    //     const container = containerRef.current;
    //     const item = itemRefs.current[index];

    //     if (container && item) {
    //         const containerRect = container.getBoundingClientRect();
    //         const itemRect = item.getBoundingClientRect();

    //         const offset = itemRect.left - containerRect.left;
    //         const scroll = offset - (container.clientWidth / 2) + (item.clientWidth / 2);

    //         container.scrollBy({
    //             left: scroll,
    //             behavior: "smooth",
    //         });
    //     }
    // };

    const [selectedMedia, setSelectedMedia] = useState(medias[0]);

    return (
        <div className="container my-4">
            <div className="border rounded overflow-hidden mb-4 text-center">
                <MediaView mediaType={selectedMedia.type} src={selectedMedia.src} height={400}/>
            </div>

            {/* Thumbnails cuộn ngang */}
            {/* <div className="thumbnail-scroll d-flex gap-2 px-2 scroll-container" */}
            <div className="d-flex flex-wrap gap-2 px-2 "
                // ref={containerRef}
                // style={{
                //     overflowX: "auto",     // Cho phép cuộn ngang
                //     overflowY: "hidden",   // Ẩn cuộn dọc
                // }}
            >
                {medias.map((media, index) => (
                    <div
                        // ref={(el) => (itemRefs.current[index] = el)}
                        onClick={() => {
                            // scrollToCenter(index);
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
                        <RecipeGalleryItem media={media}/>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecipeGallery;
