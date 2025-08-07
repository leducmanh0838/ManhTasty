import { Link } from "react-router-dom";

const MenuItemWithIcon = ({ icon, label, to = "#" }) => (
  <Link to={to} className="nav-link d-flex align-items-center text-dark mb-3">
    <span className="me-2">{icon}</span>
    <span>{label}</span>
  </Link>
);

export default MenuItemWithIcon;