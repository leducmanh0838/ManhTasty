import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Sidebar from './components/layouts/sidebar/Sidebar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './components/Home/HomePage';
import Header from './components/layouts/Header/Header';
import { AppProvider } from './provides/AppProvider';

const App = () => {

  return (
    <AppProvider>
      <BrowserRouter>
        <div className="d-flex" >
          {/* Sidebar */}
          <Sidebar />

          {/* Main Content */}
          <div className="flex-grow-1 ms-0 ms-md-1" style={{ marginLeft: '0px' }}>
            {/* Header */}
            <Header />

            <Routes>
              <Route path="/" element={<HomePage />} />
              {/* <Route path="/explore" element={<ExplorePage />} />
            <Route path="/ingredients" element={<IngredientsPage />} />
            <Route path="/my-recipes" element={<MyRecipesPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} /> */}
            </Routes>
            {/* Recipe Grid */}

          </div>
        </div>
      </BrowserRouter>
    </AppProvider>

  );
}

export default App;