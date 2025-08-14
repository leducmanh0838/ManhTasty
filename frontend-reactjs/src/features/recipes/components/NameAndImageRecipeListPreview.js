import NameAndImageRecipe from "./NameAndImageRecipe";

const NameAndImageRecipeListPreview = ({ visibleRecipes, count, onClickExtraImage }) => {

    return (
        <div className="d-flex gap-2 w-80">
            {visibleRecipes && visibleRecipes.map((recipe, index, array) => (
                index === array.length - 1 ? <NameAndImageRecipe recipe={recipe} height={200} extraCount={count - array.length} onClickExtraImage={onClickExtraImage} /> :
                    <NameAndImageRecipe recipe={recipe} height={200} />
            ))}
        </div>
    )
}

export default NameAndImageRecipeListPreview;