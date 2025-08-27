import { memo } from "react";
import { MediaType } from "../constants/mediaType";
import { getMediaCloudinary } from "../../../utils/file/getMediaCloudinary";

const MediaView = ({ mediaType, src, height = "auto", width = "auto", className, isCloudinary=false}) => {
    const style = {
        height,
        width,
        objectFit: "contain",
    };

    return mediaType !== MediaType.VIDEO.value ? (
        <img
            // src={src}
            src={isCloudinary?getMediaCloudinary(src, MediaType.IMAGE.value):src}
            alt="Selected Media"
            className={`rounded ${className}`}
            style={style}
        />
    ) : (
        <video
            src={isCloudinary?getMediaCloudinary(src, MediaType.VIDEO.value):src}
            controls
            className={`rounded ${className}`}
            style={style}
        />
    );
};

export default memo(MediaView);