import { Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from './pages/ComponentsPage';
import LoginPage from './pages/LoginPage';
import ProtectedRouteGuard from "./components/protectedRouteGuard/ProtectedRouteGuard.jsx";

const App = () => (
    <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/products" element={
            <ProtectedRouteGuard>
                <ProductsPage />
            </ProtectedRouteGuard>
        }/>
        <Route path="/components" element={
            <ProtectedRouteGuard>
                <ComponentsPage />
            </ProtectedRouteGuard>
        }/>
    </Routes>
);

export default App;
