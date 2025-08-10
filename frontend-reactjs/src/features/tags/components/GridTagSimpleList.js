import React from "react";
import { useNavigate } from "react-router-dom";

const GridTagSimpleList = ({ tags, link = true }) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-wrap gap-2 py-3">
      {tags.map((tag, index) => (
        <span key={index} className={`px-3 py-1 rounded-pill border border-2 ${link && "btn btn-light"}`} 
        onClick={() => link && navigate(`/search?keyword=${tag.name}`)}
        >
          {tag?.name}
        </span>
      ))}
    </div>
  );
}

export default GridTagSimpleList;
