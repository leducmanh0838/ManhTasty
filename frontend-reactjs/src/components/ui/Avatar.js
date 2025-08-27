// src/components/Avatar/index.jsx
import React from "react";

const Avatar = ({ src, alt = "Avatar", size = 32, className = "", ...rest }) => {
  return (
    <img
      src={src ? src : "/images/camera.png"}
      onError={(e) => { e.currentTarget.src = "/images/camera.png" }}
      alt={alt}
      className={`rounded-circle me-2 ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
      }}
      {...rest}
    />
  );
};

export default React.memo(Avatar);