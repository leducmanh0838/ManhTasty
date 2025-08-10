import { memo, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { handleDraftItemListChange, handleRemoveDraftItem } from "../../recipes/utils/draft-utils";
import FloatingInput from "../../../components/ui/FloatingInput";
import { authApis, endpoints } from "../../../configs/Apis";
import { printErrors } from "../../../utils/printErrors";

const EditIngredientItem = memo(({ ingredient, index, ingredients, setIngredients, recipeId }) => {
    console.info("render EditIngredientSection")
    const [temp, setTemp] = useState({})

    useEffect(() => {
        setTemp(ingredient);
    }, [ingredient]);

    //search!!
    const [kwSearch, setKwSearch] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const handleSearchChange = (e) => {
        const keyword = e.target.value
        setKwSearch(keyword)
        keyword ? setShowDropdown(true) : setShowDropdown(false)
    }

    const loadSearchIngredientList = async (keyword) => {
        try {
            const api = await authApis();
            const res = await api.get(`${endpoints.ingredients.list}?keyword=${keyword}&page_size=15`)
            // const res = await handleGetResponseSuggestions(keyword)
            setSuggestions(res.data.results)
        } catch (err) {
            printErrors(err);
        } finally {

        }
    }

    const handleSelectIngredient = (selectedIngredient) => {
        console.info("selectedIngredient: ", selectedIngredient)
        handleDraftItemListChange(ingredients, setIngredients, "ingredients", index, "name", selectedIngredient.name, recipeId);
        setTemp(prev=>({...prev, "name": selectedIngredient.name}))
        // const exists = tags.some(tag => tag.id === selectedIngredient.id);
        // if (!exists)
        //     handleDraftItemListChange(tags, setTags, "tags", tags.length, null, selectedIngredient, recipeId);
        // setTags(prev => [...prev, selectedTag])
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            kwSearch && loadSearchIngredientList(kwSearch);
        }, 1000);

        return () => clearTimeout(timer);
    }, [kwSearch]);

    return (
        <div className="d-flex align-items-start mb-3" key={index}>
            <div className="row me-2" style={{ flex: 1 }}>
                <div className="col-md-7 mb-1 position-relative">
                    <FloatingInput
                        type="text"
                        // className={`form-control`}
                        label={`Tên nguyên liệu ${index + 1}`}
                        value={temp.name}
                        onChange={(e) => {
                            setTemp(prev => ({
                                ...prev,
                                name: e.target.value
                            }));
                            handleSearchChange(e);
                        }}
                        onFocus={() => {
                            if (kwSearch.trim() !== "") {
                                setShowDropdown(true);
                            }
                        }}
                        onBlur={(e) => {
                            handleDraftItemListChange(ingredients, setIngredients, "ingredients", index, "name", e.target.value, recipeId);
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
                                    onClick={() => handleSelectIngredient(suggestionItem)}
                                // onMouseDown={() => handleSelectKeyword(item)}
                                >
                                    {suggestionItem.name}
                                </li>
                            ))}
                        </ul>
                    )}

                </div>
                <div className="col-md-5 mb-1">
                    <FloatingInput
                        type="text"
                        // className={`form-control`}
                        label="Số lượng (vd: 2 quả)"
                        value={temp.quantity}
                        onChange={(e) => setTemp(prev => ({
                            ...prev,
                            quantity: e.target.value
                        }))}
                        onBlur={(e) => handleDraftItemListChange(ingredients, setIngredients, "ingredients", index, "quantity", e.target.value, recipeId)}
                    // value={ingredient.quantity}
                    // onChange={(e) => handleChange(index, "quantity", e.target.value)}
                    />
                </div>
            </div>
            <button
                className="btn btn-light text-dark"
                onClick={() => handleRemoveDraftItem(setIngredients, "ingredients", index, "name", ingredient.name, recipeId)}
                // onClick={() => handleRemove(index)}
                title="Xoá"
            >
                <FaTrash />
            </button>
        </div>
    )
})

const EditIngredientSection = ({ ingredients, setIngredients, recipeId }) => {
    console.info("render EditIngredientSection")
    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    return (
        <div className="mb-3">
            {ingredients.map((ingredient, index) => (
                <EditIngredientItem {...{ ingredients, setIngredients, index, ingredient, recipeId }} />
            ))}
            <div>
                <button className="btn btn-outline-primary btn-sm" onClick={handleAddIngredient}>
                    + Thêm nguyên liệu
                </button>
            </div>
        </div>
    );
};


export default memo(EditIngredientSection);
