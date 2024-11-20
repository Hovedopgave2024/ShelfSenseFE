import { Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from './pages/ComponentsPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRouteGuard from "./components/protectedRouteGuard/ProtectedRouteGuard.jsx";
import AboutPage from "./pages/AboutPage.jsx";

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
            <Route path="/dashboard" element={
                <ProtectedRouteGuard>
                    <DashboardPage />
                </ProtectedRouteGuard>
            }/>
            <Route path="/about" element={
                <ProtectedRouteGuard>
                    <AboutPage />
                </ProtectedRouteGuard>
            }/>
    </Routes>
);

export default App;
