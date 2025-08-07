import React, { useEffect, useState } from "react";
import { TagCategory } from "../../../configs/Types";
import Apis, { endpoints } from "../../../configs/Apis";
import "./TagLayout.css";

const TagLayout = ({tags, setTags}) => {

  const [selectedTagCategory, setSelectedTagCategory] = useState(TagCategory.TYPE.toString());
  // const [tags, setTags] = useState([]);
  const [tagCollection, setTagCollection] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Apis.get(endpoints.tags.selectByTagCategory(TagCategory.TYPE));
        setTagCollection(prev => ({
          ...prev,
          [TagCategory.TYPE]: res.data
        }));

      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  const handleSelectedTagCategoryChange = async (key) => {
    console.info("key: ", key)
    if (!tagCollection.hasOwnProperty(parseInt(key))) {
      console.info("không tồn tại!!")
      try {
        const res = await Apis.get(endpoints.tags.selectByTagCategory(key));
        setTagCollection(prev => ({
          ...prev,
          [key]: res.data
        }));

      } catch (err) {
        console.error("Lỗi khi load dữ liệu:", err);
      }
    }
    setSelectedTagCategory(key);
  }

  const handleAddTag = (tagName) => {
    console.info("tags: ",tags)
    if (!tags.some(tag => tag.name === tagName)) {
      setTags([...tags, { name: tagName }]);
    }
  }

  const handleRemoveTag = (tagName) => {
    setTags(tags.filter(item => item.name !== tagName));
  }

  return (
    <div className="border rounded mb-3">
      {/* Tabs */}
      <div className="overflow-auto">
        <ul
          className="nav nav-tabs flex-nowrap d-flex border-bottom"
          style={{
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'thin'
          }}
        >
          {Object.entries(TagCategory.values)
            .filter(([key]) => parseInt(key) !== TagCategory.OTHER)
            .map(([key, label]) => (
              <li className="nav-item" key={key}>
                <button
                  className={`nav-link px-4 py-2 fw-semibold text-nowrap ${selectedTagCategory === key ? 'fw-bold' : 'fw-normal'} ${selectedTagCategory === key ? 'active-tab' : ''}`}
                  style={{ color: '#000' }}
                  onClick={() => handleSelectedTagCategoryChange(key)}
                >
                  {label}
                </button>
              </li>
            ))}
        </ul>
      </div>


      {/* Tab Content */}
      <div className="tab-content p-3">
        <div className="d-flex flex-wrap gap-2 mb-2">
          {tagCollection.hasOwnProperty(parseInt(selectedTagCategory)) &&
            tagCollection[parseInt(selectedTagCategory)].map((tag, index) => (
              <button
                key={index}
                onClick={() => handleAddTag(tag.name)}
                className="px-3 py-1 rounded-pill border border-2 btn btn-outline-secondary"
              >
                {tag.name}
              </button>
            ))}
        </div>

        <h6>Đã chọn:</h6>
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-2 mb-2">
          {tags.map((tag, index) => (
            <span key={tag.name} className="d-inline-flex align-items-center px-3 py-1 rounded-pill border border-2 me-2">
              <span className="me-2">{tag.name}</span>
              <button
                type="button"
                className="btn-close btn-sm"
                aria-label="Remove"
                onClick={() => handleRemoveTag(tag.name)}
              ></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default TagLayout;
