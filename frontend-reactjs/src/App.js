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
import EditRecipeDraftPage from './features/recipes/pages/EditRecipeDraftPage';
import CreateDraftRecipe from './features/recipes/components/CreateDraftRecipe';
import SearchPage from './features/search/pages/SearchPage';
import ProfilePage from './features/profile/pages/ProfilePage';
import ProfileOverview from './features/profile/components/ProfileOverview';
import ProfileRecipes from './features/profile/components/ProfileRecipes'
import UserRecipePage from './features/profile/pages/UserRecipePage';
import EditPublicRecipePage from './features/recipes/pages/EditPublicRecipePage';
import TrashRecipes from './features/profile/components/TrashRecipes';
import NotificationList from './features/notifications/components/NotificationList';
import CommentPage from './features/comments/pages/CommentPage';
import ChatBoxLayout from './components/chatbox/ChatBoxLayout';

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
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/dev" element={<Dev />} />
              <Route path="/recipes/:idSlug" element={<PublicRecipeDetailPage />} />
              <Route path="/recipes/:idSlug/edit" element={<EditPublicRecipePage />} />
              <Route path="/recipes-draft" element={<CreateDraftRecipe />} />
              <Route path="/recipes-draft/:recipeId/edit" element={<EditRecipeDraftPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/comments/:commentId" element={<CommentPage />} />
              
              <Route path="/profile" element={<ProfilePage />} >
                <Route index element={<ProfileOverview />} />
                <Route path="recipes" element={<ProfileRecipes />} />
                <Route path="trashes" element={<TrashRecipes />} />
                <Route path="notifications" element={<NotificationList />} />
                {/* NotificationList */}
              </Route>
              {/* CurrentUserRecipePage */}
              <Route path="/users/:userId/recipes" element={<UserRecipePage />} />
            </Routes>

            {/* Recipe Grid */}
            <ChatBoxLayout/>

          </div>
        </div>
      </BrowserRouter>
    </AppProvider>

  );
}

export default App;