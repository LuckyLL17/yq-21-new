import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { SnackDetail } from './pages/SnackDetail';
import { Records } from './pages/Records';
import { Favorites } from './pages/Favorites';
import { ExercisePlan } from './pages/ExercisePlan';
import { ThemeProvider } from './utils/ThemeContext';
import { FavoritesProvider } from './utils/useFavorites';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/snack/:id" element={<SnackDetail />} />
              <Route path="/records" element={<Records />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/exercise-plan" element={<ExercisePlan />} />
            </Routes>
          </div>
        </Router>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
