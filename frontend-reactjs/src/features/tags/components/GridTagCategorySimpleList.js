import { memo, useEffect, useState } from "react";
import { TagCategory, TagCategoryList } from "../constrants/tagCategory";
import { Dropdown } from "react-bootstrap";
import Apis, { endpoints } from "../../../configs/Apis";
import { useNavigate } from "react-router-dom";

const GridTagCategorySimple = ({ category }) => {
    const [tags, setTags] = useState([]);
    const nav = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Apis.get(`${endpoints.tags.list}?tag_category=${category.value}`)
                setTags(res.data.results);
            }
            catch (err) {

            } finally {

            }
        }
        fetchData();
    }, [])
    return (
        <Dropdown>
            <Dropdown.Toggle variant="light" id="dropdown-basic">
                {category.icon} {category.label}
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {tags.map((tag) => <>
                {/* http://localhost:3000/search?keyword=%C4%83n%20chay */}
                    <Dropdown.Item className="btn btn-light rounded" href="#" onClick={() => nav(`/search?keyword=${tag.name}`)}>{tag.name}</Dropdown.Item>
                </>)}
            </Dropdown.Menu>
        </Dropdown>
    )
}

const GridTagCategorySimpleList = () => {

    return (
        <>
            <div className="d-flex flex-wrap gap-2 py-3">
                {TagCategoryList.map((category, index) => (
                    category.value !== TagCategory.OTHER.value &&
                    <GridTagCategorySimple category={category} />
                    // <span key={index} className={`px-3 py-1 rounded-pill border border-2`}
                    // // ${link && "btn btn-light"}
                    // // onClick={() => link && navigate(`/search?keyword=${category.name}`)}
                    // >
                    //     {category?.label}
                    // </span>
                ))}
            </div>
        </>
    )
}

export default memo(GridTagCategorySimpleList);