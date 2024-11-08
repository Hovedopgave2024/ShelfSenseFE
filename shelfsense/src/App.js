// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from "./pages/ComponentsPage";

const App = () => (
    <Router>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
          <Route path="/components" element={<ComponentsPage /> } />
      </Routes>
    </Router>
);

export default App;