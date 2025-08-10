import { authApis, endpoints } from "../../../configs/Apis";
import { printErrors } from "../../../utils/printErrors";

// onBlur={(e) => handleDraftChange(steps, setSteps, "steps", index, "description", e.target.value, recipeId)}
export async function handleDraftItemListChange(items, setItems, field, index, subField, value, recipeId) {
    try {
        const api = await authApis();
        const keyField = [field, index, subField]
            .filter(v => v !== null && v !== undefined && v !== "")
            .join(".");
        // console.info("index: ", index)
        // console.info("keyField: ", keyField)
        const res = await api.patch(endpoints.recipes.draft.detail(recipeId), {
            [keyField]: value
        })
        handleItemListChange(items, setItems, index, subField, value)
    } catch (err) {
        printErrors(err);
    } finally {

    }
}

export async function handleDraftChange(setItems, field, value, recipeId) {
    try {
        const api = await authApis();
        // const keyField = [field, index, subField]
        //     .filter(v => v !== null && v !== undefined && v !== "")
        //     .join(".");
        // console.info("index: ", index)
        // console.info("keyField: ", keyField)
        console.info("json: ", {
            [field]: value
        })
        const res = await api.patch(endpoints.recipes.draft.detail(recipeId), {
            [field]: value
        })
        setItems(value);
        // handleItemListChange(items, setItems, index, subField, value)
    } catch (err) {
        printErrors(err);
    } finally {

    }
}

// handleRemoveDraftItem(setSteps, "steps", index, "description", step.description, recipeId)
export async function handleRemoveDraftItem(setItems, field, index, subField, value, recipeId) {
    try {
        console.info(JSON.stringify({
            "$pull": {
                [field]: {
                    [subField]: value
                }
            }
        }, null, 2))
        const api = await authApis();
        const res = await api.patch(endpoints.recipes.draft.detail(recipeId),
            {
                "$pull": {
                    [field]: {
                        [subField]: value
                    }
                }
            })
        handleRemoveItem(index, setItems)
    } catch (err) {
        printErrors(err)
    }

}

export function handleItemListChange(items, setItems, index, subField, value) {
    const newItems = [...items];
    if (subField)
        newItems[index][subField] = value;
    else
        newItems[index] = value;
    setItems(newItems);
}

export function handleRemoveItem(index, setItems) {
    setItems(prev => prev.filter((_, i) => i !== index));
};