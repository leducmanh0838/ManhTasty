import { mockRecipes } from "../../mocks/homepage";

const HomePage = () => {
    return (
        <main className="py-4 px-3 recipe-grid">
            {mockRecipes.map((recipe) => (
                <div
                    key={recipe.id}
                    className="card shadow-sm mb-4"
                    style={{ breakInside: 'avoid', width: '100%' }}
                >
                    <img
                        src={recipe.image}
                        alt={recipe.title}
                        className="card-img-top"
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                    />
                    <div className="card-body text-center p-2">
                        <p className="card-text fw-medium small mb-0">{recipe.title}</p>
                    </div>
                </div>
            ))}
        </main>
    )
}

export default HomePage;