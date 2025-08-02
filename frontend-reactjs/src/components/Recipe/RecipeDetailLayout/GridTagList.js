import React from "react";

const GridTagList = ({ tags }) => {
  return (
    <div className="d-flex flex-wrap gap-2 p-3">
      {tags.map((tag, index) => (
        <span key={index} className="px-3 py-1 rounded-pill border border-2">
          {tag}
        </span>
      ))}
    </div>
  );
}

export default GridTagList;
