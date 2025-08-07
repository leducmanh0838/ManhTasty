import RecipeCardSimp from "../RecipeCardSimple"

const RecipeCardSimpleList = ({ recipes }) => {
    return(
        <main className="py-4 px-3 recipe-grid">
            {recipes?.map((recipe) => (
                <RecipeCardSimp recipe={recipe}/>
            ))}
        </main>
    )
}

export default RecipeCardSimpleList;