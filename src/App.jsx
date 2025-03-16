import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalog from './views/Catalog';
import Admin from './views/Admin';
import { LocalDBProvider } from './services/LocalDB';

// Componente para determinar las clases CSS según la ruta
const MainContainer = ({ children }) => {
  const location = useLocation();
  
  // Determinar la clase según la ruta actual
  let viewClass = '';
  if (location.pathname === '/') {
    viewClass = 'home-view scrollable-view';
  } else if (location.pathname.startsWith('/admin')) {
    viewClass = 'admin-view scrollable-view';
  } else if (location.pathname.startsWith('/catalog/')) {
    viewClass = 'catalog-view';
  }
  
  return (
    <main className={`container py-4 flex-grow-1 ${viewClass}`}>
      {children}
    </main>
  );
};

const App = () => {
  return (
    <LocalDBProvider>
      <Router>
        <div className="page-container">
          <Header />
          <MainContainer>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog/:id" element={<Catalog />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </MainContainer>
          <Footer />
        </div>
      </Router>
    </LocalDBProvider>
  );
};

export default App;