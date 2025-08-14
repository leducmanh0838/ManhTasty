// src/components/Avatar/index.jsx
import React from "react";

const Avatar = ({ src, alt = "Avatar", size = 32, className = "" }) => {
  return (
    <img
      src={src}
      alt={alt}
      className={`rounded-circle me-2 ${className}`}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
      }}
    />
  );
};

export default React.memo(Avatar);