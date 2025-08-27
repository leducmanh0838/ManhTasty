import { memo, useEffect, useState } from "react";
import FloatingInput from "../../../components/ui/FloatingInput";
import { printErrors } from "../../../utils/printErrors";
import { authApis, endpoints } from "../../../configs/Apis";
import { handleDraftItemListChange, handleItemListChange, handleRemoveDraftItem, handleRemoveItem } from "../../recipes/utils/draft-utils";
import SearchAutocompleteSimple from "../../search/components/SearchAutocompleteSimple";

const EditTagItemList = memo(({ tags, setTags, recipeId, setSaving, isDraft=true }) => {
    return (
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
            {tags && tags.length > 0 && tags.map((tag, index) => (
                <span key={tag.name} className="d-inline-flex align-items-center px-3 py-1 rounded-pill border border-2 me-1">
                    <span className="me-1">{tag.name}</span>
                    <button
                        type="button"
                        className="btn-close btn-sm"
                        aria-label="Remove"
                        // onClick={() => handleRemoveTag(tag.name)}
                        onClick={() => {
                            isDraft ? handleRemoveDraftItem(setTags, "tags", index, "id", tag.id, recipeId, setSaving):
                            handleRemoveItem(index, setTags)
                        }}
                    ></button>
                </span>
            ))}
        </div>
    )
})

const EditTagSection = ({ tags, setTags, recipeId, setSaving, isDraft=true }) => {

    const handleGetResponseSuggestions = async (keyword) => {
        const api = await authApis();
        const res = await api.get(`${endpoints.tags.list}?keyword=${keyword}&page_size=15`)
        return res.data.results;
    }

    const handleSelectTag = (selectedTag) => {
        const exists = tags.some(tag => tag.id === selectedTag.id);
        if (!exists){
            isDraft ? handleDraftItemListChange(tags, setTags, "tags", tags.length, null, selectedTag, recipeId, setSaving):
            handleItemListChange(tags, setTags, tags.length, null, selectedTag)
        }
        // setTags(prev => [...prev, selectedTag])
    }

    return (
        <>
            <SearchAutocompleteSimple handleSelectItem={handleSelectTag} handleGetResponseSuggestions={handleGetResponseSuggestions} />
            {/* <div className="position-relative flex-grow-1">
                <FloatingInput id="tag" label="Tìm kiếm tag" value={tagSearch}
                    onChange={handleSearchChange}
                    onFocus={() => {
                        if (tagSearch.trim() !== "") {
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
                        {suggestions.map((tagSuggestion, index) => (
                            <li
                                key={index}
                                className="list-group-item list-group-item-action"
                                style={{ cursor: "pointer" }}
                                onClick={() => handleSelectTag(tagSuggestion)}
                            // onMouseDown={() => handleSelectKeyword(item)}
                            >
                                {tagSuggestion.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div> */}

            <div className="mt-2">
                <EditTagItemList tags={tags} setTags={setTags} recipeId={recipeId} setSaving={setSaving} isDraft={isDraft}/>
            </div>
        </>

    )
}

export default memo(EditTagSection);