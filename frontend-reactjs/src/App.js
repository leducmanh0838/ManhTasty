import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './provides/AppProvider';
import { ToastContainer } from 'react-toastify';
import HomePage from './pages/HomePage';
import Dev from './components/Dev';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import PublicRecipeDetailPage from './features/recipes/pages/PublicRecipeDetailPage';
import EditRecipePage from './features/recipes/pages/EditRecipePage';
import CreateDraftRecipe from './features/recipes/components/CreateDraftRecipe';

const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="d-flex" >
          {/* Sidebar */}
          <ToastContainer
            position="top-center"
            autoClose={10000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Sidebar />

          {/* Main Content */}
          <div className="flex-grow-1 ms-0 ms-md-1" style={{ marginLeft: '0px' }}>
            {/* Header */}
            <Header />
            <div className='p-2'>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/dev" element={<Dev />} />
                <Route path="/recipes/:idSlug" element={<PublicRecipeDetailPage />}/>
                <Route path="/recipes-draft" element={<CreateDraftRecipe />}/>
                <Route path="/recipes-draft/:recipeId/edit" element={<EditRecipePage />}/>
                {/* <Route path="/recipes/:idSlug" element={<RecipeDetail />} />
                <Route path="/create-recipe" element={<RecipeCreation />} />
                <Route path="/search" element={<Search />} /> */}
              </Routes>
            </div>

            {/* Recipe Grid */}

          </div>
        </div>
      </BrowserRouter>
    </AppProvider>

  );
}

export default App;