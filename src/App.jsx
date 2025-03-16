import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './views/Home';
import Catalog from './views/Catalog';
import Admin from './views/Admin';
import { LocalDBProvider } from './services/LocalDB';

const App = () => {
  return (
    <LocalDBProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <Header />
          <main className="container py-4 flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog/:id" element={<Catalog />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </LocalDBProvider>
  );
};

export default App;