import { memo, useEffect, useState } from "react";
import FloatingInput from "../../../components/ui/FloatingInput";
import { authApis, endpoints } from "../../../configs/Apis";
import { printErrors } from "../../../utils/printErrors";

const SearchAutocompleteSimple = ({handleSelectItem, handleGetResponseSuggestions}) => {
    const [kwSearch, setKwSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const keyword = e.target.value
        setKwSearch(keyword)
        keyword ? setShowDropdown(true) : setShowDropdown(false)
    }

    const loadSearchTagList = async (keyword) => {
        try {
            // const api = await authApis();
            // const res = await api.get(`${endpoints.tags.list}?keyword=${keyword}&page_size=15`)
            const res = await handleGetResponseSuggestions(keyword)
            setSuggestions(res.data.results)
        } catch (err) {
            printErrors(err);
        } finally {

        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            kwSearch && loadSearchTagList(kwSearch);
        }, 1000);

        return () => clearTimeout(timer);
    }, [kwSearch]);

    return (
        <>
            <div className="position-relative flex-grow-1">
                <FloatingInput id="tag" label="Tìm kiếm tag" value={kwSearch}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        if (kwSearch.trim() !== "") {
                            setShowDropdown(true);
                        }
                    }}
                    onBlur={() => {
                        // Nếu click vào dropdown thì cần trì hoãn ẩn
                        setTimeout(() => {
                            setShowDropdown(false);
                        }, 200);
                    }}
                />
                {showDropdown && suggestions.length > 0 && (
                    <ul
                        className="list-group position-absolute shadow"
                        style={{
                            zIndex: 999,
                            top: "110%",
                            width: "100%",
                            maxHeight: '200px',
                            overflowY: 'auto'
                        }}
                    >
                        {suggestions.map((suggestionItem, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelectItem(suggestionItem)}
                            // onMouseDown={() => handleSelectKeyword(item)}
                            >
                                {suggestionItem.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}
export default memo(SearchAutocompleteSimple);