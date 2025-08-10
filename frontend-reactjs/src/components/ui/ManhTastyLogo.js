import React from "react";
import { Link } from "react-router-dom";

// src/components/Logo.js
const ManhTastyLogo = ({ size = 120, link=true }) => {
    const TagHTML = link ? Link : "div";
    return (
        <div className="text-center fw-bold fs-4 mb-4 d-flex flex-column align-items-center mx-3">
            <TagHTML to={link ? "/" : undefined}>
                <img
                    src="/icons/logo.png"
                    alt="ManhTasty Logo"
                    style={{ width: `${size}px`, height: `${size}px`, marginBottom: '8px' }}
                />
            </TagHTML>
            <div>
                <span style={{ fontFamily: 'Arial Black', color: '#f57c00' }}>Manh</span>
                <span style={{ fontFamily: 'Pacifico, cursive', color: '#6d4c41' }}>Tasty</span>
            </div>
        </div>
    );
};

export default React.memo(ManhTastyLogo);