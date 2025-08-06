import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/layouts/sidebar/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Header from './components/layouts/Header/Header';
import { AppProvider } from './provides/AppProvider';
import RecipeDetail from './components/Recipe/RecipeDetail';
import { ToastContainer } from 'react-toastify';
import RecipeCreation from './components/Recipe/RecipeCreation/RecipeCreation';

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
                {/* <Route path="/explore" element={<ExplorePage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/my-recipes" element={<MyRecipesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} /> */}
                <Route path="/recipes/:idSlug" element={<RecipeDetail />} />
                <Route path="/create-recipe" element={<RecipeCreation />} />
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