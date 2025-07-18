import { Link } from "react-router-dom";

// src/components/Logo.js
const LogoAndName = ({ size = 120 }) => {
  return (
    <div className="text-center fw-bold fs-4 mb-4 d-flex flex-column align-items-center mx-3">
      <Link to="/">
        <img
          src="/icons/logo.png"
          alt="ManhTasty Logo"
          style={{ width: `${size}px`, height: `${size}px`, marginBottom: '8px' }}
        />
      </Link>
      <div>
        <span style={{ fontFamily: 'Arial Black', color: '#f57c00' }}>Manh</span>
        <span style={{ fontFamily: 'Pacifico, cursive', color: '#6d4c41' }}>Tasty</span>
      </div>
    </div>
  );
};

export default LogoAndName;