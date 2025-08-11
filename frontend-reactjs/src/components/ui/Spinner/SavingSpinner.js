import React from "react";

const SavingSpinner = ({ size = "md", text = "Đang tải dữ liệu..." }) => {
  const sizeClass = {
    sm: "spinner-border spinner-border-sm",
    md: "spinner-border",
    lg: "spinner-border",
  };

  const sizeStyle = {
    sm: { width: "1.5rem", height: "1.5rem" },
    md: { width: "2rem", height: "2rem" },
    lg: { width: "3rem", height: "3rem" },
  };

  const className = sizeClass[size] || sizeClass["md"];
  const style = sizeStyle[size] || sizeStyle["md"];

  return (
    <div className="d-flex align-items-center justify-content-center">
      <div className={className} style={style} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <div className="ms-2 text-muted">{text}</div>}
    </div>
  );
};

export default React.memo(SavingSpinner);
