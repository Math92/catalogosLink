// App.jsx con corrección para acceso a la ruta admin
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Home from './views/Home';
import Catalog from './views/Catalog';
import Admin from './views/Admin';
import { LocalDBProvider } from './services/LocalDB';

const App = () => {
  return (
    <LocalDBProvider>
      <Router>
        <div className="container-fluid p-0">
          <Header />
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalog/:id" element={<Catalog />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </LocalDBProvider>
  );
};

export default App;