import React from "react";
import { FaCamera } from "react-icons/fa";

const CameraInputUI = ({iconSize=40}) => {
    return (
        <div className="w-100 w-100 d-flex align-items-center justify-content-center rounded-3"
            style={{
                backgroundColor: "#faf8f5",
                border: "2px dashed #ddd",
            }}
        >
            <FaCamera size={iconSize} color="#ccc" />
        </div>
    )
}

export default React.memo(CameraInputUI);