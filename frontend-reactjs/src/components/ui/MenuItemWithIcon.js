import React from "react";
import { Link } from "react-router-dom";

const MenuItemWithIcon = ({ icon, label, className, notificationCount, ...rest }) => (
  <div className={`nav-link d-flex align-items-center text-dark text-nowrap ${className}`}
    {...rest}
  >
    {/* <span className="me-2">{icon}</span> */}
    <span className="position-relative me-2">
      {icon}
      {Number(notificationCount) > 0 &&
        <span className="position-absolute top-40 start-100 translate-middle badge rounded-pill bg-danger"
          style={{ fontSize: '10px' }}
        >
          {notificationCount}
          <span className="visually-hidden">unread messages</span>
        </span>}

    </span>
    <span>{label}</span>
  </div>
);

export default React.memo(MenuItemWithIcon);