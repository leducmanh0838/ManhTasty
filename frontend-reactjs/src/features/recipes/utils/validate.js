import { toast } from "react-toastify"
import { validateString, validateStringWithMessage } from "../../../utils/validate/validateString"
import { MAX_DESCRIPTION_LENGTH, MAX_INGREDIENT_NAME_LENGTH, MAX_INGREDIENT_QUANTITY_LENGTH, MAX_INGREDIENTS, MAX_MEDIAS, MAX_STEP_DESCRIPTION_LENGTH, MAX_TAGS, MAX_TITLE_LENGTH, MIN_DESCRIPTION_LENGTH, MIN_INGREDIENT_NAME_LENGTH, MIN_INGREDIENT_QUANTITY_LENGTH, MIN_INGREDIENTS, MIN_STEP_DESCRIPTION_LENGTH, MIN_STEPS, MIN_TITLE_LENGTH } from "../constants/recipeRule"
import { TITLE_VALIDATION_REGEX } from "../constants/validateRegex"

export function validateSubmitRecipe(title, description, image, medias, tags, ingredients, steps) {
    // if (!validateString(title, MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, TITLE_VALIDATION_REGEX)) {
    //     toast.warning("VALIDATE");
    //     return
    // }
    const titleMessage = validateStringWithMessage(title, "Tiêu đề", MIN_TITLE_LENGTH, MAX_TITLE_LENGTH, TITLE_VALIDATION_REGEX, "Tiêu đề chỉ cho phép chữ, số, khoảng trắng và các ký tự: - _ . , ! ? ( )");
    if (titleMessage) {
        toast.warning(titleMessage);
        return false;
    }

    const descriptionMessage = validateStringWithMessage(description, `Mô tả món ăn`, MIN_DESCRIPTION_LENGTH, MAX_DESCRIPTION_LENGTH);
    if (descriptionMessage) {
        toast.warning(descriptionMessage);
        return false; // Thoát toàn bộ function
    }

    if (!image) {
        toast.warning("Chưa có ảnh chính minh họa!");
        return false;
    }
    if (medias.length > MAX_MEDIAS) {
        toast.warning(`Không được quá ${MAX_MEDIAS} ảnh hoặc video`);
        return false;
    }

    if (steps.length < MIN_STEPS) {
        toast.warning(`Số bước làm phải hơn ${MIN_STEPS} bước`);
        return false;
    }

    if (steps.length > MAX_MEDIAS) {
        toast.warning(`Số bước làm không được quá ${MAX_MEDIAS} bước`);
        return false;
    }

    for (let [index, step] of steps.entries()) {
        const stepMessage = validateStringWithMessage(step.description, `Mô tả bước ${index + 1}`, MIN_STEP_DESCRIPTION_LENGTH, MAX_STEP_DESCRIPTION_LENGTH);
        if (stepMessage) {
            toast.warning(stepMessage);
            return false; // Thoát toàn bộ function
        }
    }

    if (tags.length > MAX_TAGS) {
        toast.warning(`Số tag không được quá ${MAX_TAGS} tag`);
        return false;
    }

    if (ingredients.length < MIN_INGREDIENTS) {
        toast.warning(`Số nguyên liệu phải hơn ${MIN_INGREDIENTS} nguyên liệu`);
        return false;
    }

    if (ingredients.length > MAX_INGREDIENTS) {
        toast.warning(`Số nguyên liệu không được quá ${MAX_INGREDIENTS} nguyên liệu`);
        return false;
    }

    for (let [index, ingredient] of ingredients.entries()) {
        const nameMessage = validateStringWithMessage(ingredient.name, `Tên nguyên liệu thứ ${index + 1}`, MIN_INGREDIENT_NAME_LENGTH, MAX_INGREDIENT_NAME_LENGTH);
        if (nameMessage) {
            toast.warning(nameMessage);
            return false; // Thoát toàn bộ function
        }
        const quantityMessage = validateStringWithMessage(ingredient.quantity, `Số lượng của nguyên liệu thứ ${index + 1}`, MIN_INGREDIENT_QUANTITY_LENGTH, MAX_INGREDIENT_QUANTITY_LENGTH);
        if (quantityMessage) {
            toast.warning(quantityMessage);
            return false; // Thoát toàn bộ function
        }
    }
    return true;
}