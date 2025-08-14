import { memo, useEffect, useState } from "react";
import FloatingInput from "../../../components/ui/FloatingInput";
import { printErrors } from "../../../utils/printErrors";

const SearchAutocompleteSimple = ({ handleSelectItem, handleGetResponseSuggestions, keyword = "name", defaultKeywords = [], onSubmit, label="Tìm kiếm tag" }) => {
    const [kwSearch, setKwSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    useEffect(() => {
        defaultKeywords && defaultKeywords.length > 0 && setSuggestions(defaultKeywords);
    }, [defaultKeywords])

    const handleSearchChange = (e) => {
        const keyword = e.target.value
        setKwSearch(keyword)
        // keyword ? setShowDropdown(true) : setShowDropdown(false)
    }

    const loadSearchTagList = async (keyword) => {
        try {
            // const api = await authApis();
            // const res = await api.get(`${endpoints.tags.list}?keyword=${keyword}&page_size=15`)
            const suggestionData = await handleGetResponseSuggestions(keyword)
            setSuggestions(suggestionData)
        } catch (err) {
            printErrors(err);
        } finally {

        }
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            // kwSearch ? loadSearchTagList(kwSearch):setSuggestions(defaultKeywords)
            if (kwSearch) {
                loadSearchTagList(kwSearch)
            }
            else {
                console.info("setSuggestions(defaultKeywords)")
                defaultKeywords && setSuggestions(defaultKeywords)
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [kwSearch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit && onSubmit(kwSearch);

    };

    return (
        <>
            <div className="position-relative flex-grow-1">
                <form onSubmit={handleSubmit}>
                    <FloatingInput id="tag" label={label} value={kwSearch}
                        onChange={handleSearchChange}
                        onFocus={() => {
                            setShowDropdown(true);
                            console.info("onFocus setShowDropdown(true)")
                            // if (kwSearch.trim() !== "") {
                            //     setShowDropdown(true);
                            // }
                        }}
                        onBlur={() => {
                            // Nếu click vào dropdown thì cần trì hoãn ẩn
                            setTimeout(() => {
                                setShowDropdown(false);
                            }, 200);
                        }}
                    />
                </form>
                {showDropdown && suggestions && suggestions.length > 0 && (
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
                                <div className="d-flex justify-content-between align-items-center w-100">
                                    <div>
                                        {suggestionItem.icon && <span className="me-2">{suggestionItem.icon}</span>}
                                        {suggestionItem[keyword]}
                                    </div>
                                    <div>
                                        {suggestionItem.text && <span className="me-2">{suggestionItem.text}</span>}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    )
}
export default memo(SearchAutocompleteSimple);