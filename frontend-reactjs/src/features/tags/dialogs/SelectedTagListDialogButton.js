import { memo, useEffect, useState } from "react";
import Apis, { endpoints } from "../../../configs/Apis";
import { TagCategoryList } from "../constrants/tagCategory";
import { FaTag } from "react-icons/fa";
import { Button, Modal } from "react-bootstrap";
import MenuItemWithIcon from "../../../components/ui/MenuItemWithIcon";
import { useLocation, useNavigate } from "react-router-dom";

const SelectedSubTagList = ({ category, toggleTag, selectedTagArr }) => {
    const [tags, setTags] = useState([]);
    // const nav = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await Apis.get(`${endpoints.tags.list}?tag_category=${category.value}&page_size=100`)
                setTags(res.data.results);
            } catch (err) {

            }
        }
        fetchData();
    }, [])
    return (<>
        <div className="d-flex flex-wrap gap-2 py-3">
            {tags.map((tag, index) => {
                const isSelected = selectedTagArr.includes(tag.id);
                return (
                    <span
                        key={index}
                        onClick={() => toggleTag(tag.id)}
                        className={`px-3 py-1 rounded-pill border border-2 btn ${isSelected ? "btn-primary text-white" : "btn-light"
                            }`}
                        style={{ cursor: "pointer" }}
                    >
                        {tag?.name}
                    </span>
                );
            })}
        </div>
    </>)
}

const SelectedTagList = ({ selectedTagArr, setSelectedTagArr }) => {

    const toggleTag = (tagId) => {
        setSelectedTagArr((prev) => {
            if (prev.includes(tagId)) {
                // Nếu đã có trong mảng, xóa
                return prev.filter((id) => id !== tagId);
            } else {
                // Nếu chưa có, thêm vào
                return [...prev, tagId];
            }
        });
    };

    // const toggleTag = (tagId) => {
    //     setSelectedTagArr((prev) => {
    //         let newSelected;
    //         if (prev.includes(tagId)) {
    //             newSelected = prev.filter((id) => id !== tagId);
    //         } else {
    //             newSelected = [...prev, tagId];
    //         }
    //         // Cập nhật URL mỗi khi thay đổi
    //         updateTags(newSelected);
    //         return newSelected;
    //     });
    // };

    return (<>
        <div className="container">
            {TagCategoryList.map((category, index) => (
                <>
                    <div className="d-flex align-items-center">
                        <span className="">{category.label}</span>
                        <div className="flex-grow-1 border-bottom ms-2"></div>
                    </div>
                    <SelectedSubTagList {...{ category, toggleTag, selectedTagArr }} />
                </>
                // <span key={index} className={`px-3 py-1 rounded-pill border border-2`}
                // // ${link && "btn btn-light"}
                // // onClick={() => link && navigate(`/search?keyword=${category.name}`)}
                // >
                //     {category?.label}
                // </span>
            ))}
        </div>
    </>)
}

const SelectedTagListDialogButton = () => {
    const [selectedTagArr, setSelectedTagArr] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    const handleFilter = () => {
        const searchParams = new URLSearchParams(location.search);

        // Xóa param 'tags' cũ
        searchParams.delete("tags");

        // Thêm các tag mới
        selectedTagArr.forEach((tagId) => searchParams.append("tags", tagId));

        // Cập nhật URL hoặc fetch API
        navigate({ pathname: location.pathname, search: searchParams.toString() });
    };

    return (
        <>
            <button className={`btn btn-light btn-sm text-start`}
                onClick={() => { setShowModal(true) }}
            >
                <MenuItemWithIcon icon={<FaTag />} label={"Chọn thẻ (tag)"} />
            </button>
            <Modal show={showModal} onHide={() => setShowModal(false)} centered >
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">Báo cáo</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                        <SelectedTagList {...{ selectedTagArr, setSelectedTagArr }} />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={() => {
                        // setShowModal(false);
                        setSelectedTagArr([]);
                    }}>
                        Làm mới
                    </Button>
                    <Button variant="success" onClick={() => {
                        setShowModal(false);
                        handleFilter();
                    }}>
                        Áp dụng bộ lọc
                    </Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default memo(SelectedTagListDialogButton);