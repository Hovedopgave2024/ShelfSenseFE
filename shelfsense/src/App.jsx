import { Route, Routes } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import ComponentsPage from './pages/ComponentsPage';
import LoginPage from './pages/LoginPage';
import StatisticsPage from './pages/StatisticsPage.jsx';
import ProtectedRouteGuard from "./components/protectedRouteGuard/ProtectedRouteGuard.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import SalesOrdersPage from "./pages/SalesOrdersPage.jsx";

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
            <Route path="/salesorders" element={
                <ProtectedRouteGuard>
                    <SalesOrdersPage />
                </ProtectedRouteGuard>
            }/>
            <Route path="/statistics" element={
                <ProtectedRouteGuard>
                    <StatisticsPage />
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
