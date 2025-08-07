import React from "react";
import { useNavigate } from "react-router-dom";

const GridTagList = ({ tags }) => {
  const navigate = useNavigate();
  return (
    <div className="d-flex flex-wrap gap-2 py-3">
      {tags.map((tag, index) => (
        <span key={index} className="px-3 py-1 rounded-pill border border-2 btn btn-light" onClick={()=>navigate(`/search?keyword=${tag}`)}>
          {tag}
        </span>
      ))}
    </div>
  );
}

export default GridTagList;
