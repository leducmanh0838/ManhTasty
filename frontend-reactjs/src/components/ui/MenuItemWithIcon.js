import React from "react";
import { Link } from "react-router-dom";

const MenuItemWithIcon = ({ icon, label}) => (
  <div className="nav-link d-flex align-items-center text-dark text-nowrap">
    <span className="me-2">{icon}</span>
    <span>{label}</span>
  </div>
);

export default React.memo(MenuItemWithIcon);