import { useState } from "react";
import { useNavigate } from "react-router-dom";

const keywordSuggestions = [
        "Phở bò",
        "Bún chả",
        "Gà kho gừng",
        "Canh chua",
        "Trứng chiên",
        "Bánh xèo",
    ];

const SearchBar = () => {
    const [keyword, setKeyword] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();
    // const currentUserInfo = currentUser.user

    const [suggestions, setSuggestions] = useState(keywordSuggestions);

    const handleSubmitKeyword = (e) => {
        e.preventDefault();
        // setShowDropdown(false);
        if (keyword.trim()) {
            navigate(`/search?keyword=${encodeURIComponent(keyword.trim())}`);
        }
    }

    const handleSelectKeyword = (kw) => {
        navigate(`/search?keyword=${encodeURIComponent(kw)}`);
    }
    return (
        // <form onSubmit={handleSubmitKeyword} className="d-flex flex-grow-1 me-3">
        <form onSubmit={handleSubmitKeyword}>
            <div className="position-relative flex-grow-1">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm món ăn, nguyên liệu..."
                    value={keyword}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 150)} // delay để click vào item
                    onChange={(e) => setKeyword(e.target.value)}
                />
                {showDropdown && suggestions.length > 0 && (
                    <ul
                        className="list-group position-absolute shadow"
                        style={{
                            zIndex: 999,
                            top: "110%",
                            width: "100%",
                        }}
                    >
                        {suggestions.map((item, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                style={{ cursor: "pointer" }}
                                onMouseDown={() => handleSelectKeyword(item)}
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    )
}
export default SearchBar;