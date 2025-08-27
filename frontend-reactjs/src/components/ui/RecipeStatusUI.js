import { RecipeStatusList } from "../../features/recipes/constants/recipeStatus";

const RecipeStatusUI = ({ recipeStatusNumber }) => {
    // const tag = tags.find(t => t.id === tagIdToFind);
    const recipeStatus = RecipeStatusList.find(i => i.value === recipeStatusNumber);
    return (
        <span className="badge" style={{
            backgroundColor: recipeStatus.color
        }}>
            {recipeStatus.label}
        </span>)
}

export default RecipeStatusUI;