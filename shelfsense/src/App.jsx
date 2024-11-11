import { Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from './pages/ComponentsPage';

const App = () => (
    <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/components" element={<ComponentsPage />} />
    </Routes>
);

export default App;
