import NameAndImageRecipe from "./NameAndImageRecipe";

const NameAndImageRecipeListPreview = ({ visibleRecipes, count, onClickExtraImage, height=200 }) => {

    return (
        <div className="d-flex gap-2 w-80">
            {visibleRecipes && visibleRecipes.map((recipe, index, array) => (
                index === array.length - 1 ? <NameAndImageRecipe recipe={recipe} height={height} extraCount={count && count - array.length} onClickExtraImage={onClickExtraImage} /> :
                    <NameAndImageRecipe recipe={recipe} height={height} />
            ))}
        </div>
    )
}

export default NameAndImageRecipeListPreview;