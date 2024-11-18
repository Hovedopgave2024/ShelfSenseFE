import { Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from './pages/ComponentsPage';
import LoginPage from './pages/LoginPage';

const App = () => (
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/products" element={
                <ProductsPage />
        }/>
        <Route path="/components" element={
                <ComponentsPage />
        }/>
    </Routes>
);

export default App;
