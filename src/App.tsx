import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { SnackDetail } from './pages/SnackDetail';
import { Records } from './pages/Records';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/snack/:id" element={<SnackDetail />} />
          <Route path="/records" element={<Records />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
