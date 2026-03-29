import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Cart from './pages/Cart';
import About from './pages/About';
import Register from './pages/Register';
import Unauthorized401 from './pages/Unauthorized401';
import Forbidden403 from './pages/Forbidden403';
import NotFound404 from './pages/NotFound404';
import InventoryVisibility from './pages/InventoryVisibility';
import DetailedInfoShowcase from './pages/DetailedInfoShowcase';
import SmartOrganizationShowcase from './pages/SmartOrganizationShowcase';
import AdminApp from './admin/AdminApp';
import './styles/App.css';

const AppLayout = () => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
    const isShowcaseRoute =
        location.pathname.startsWith('/inventory-visibility') ||
        location.pathname.startsWith('/informatii-detaliate') ||
        location.pathname.startsWith('/organizare-inteligenta');
    const hideLayout = isAdminRoute || isAuthPage || isShowcaseRoute;

    return (
        <div className="app">
            {!hideLayout && <Header />}

            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/401" element={<Unauthorized401 />} />
                    <Route path="/403" element={<Forbidden403 />} />
                    <Route path="/404" element={<NotFound404 />} />
                    <Route path="/inventory-visibility" element={<InventoryVisibility />} />
                    <Route path="/informatii-detaliate" element={<DetailedInfoShowcase />} />
                    <Route path="/organizare-inteligenta" element={<SmartOrganizationShowcase />} />

                    <Route
                        path="/cart"
                        element={
                            <ProtectedRoute>
                                <Cart />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/admin/*"
                        element={
                            <ProtectedRoute requireAdmin>
                                <AdminApp />
                            </ProtectedRoute>
                        }
                    />

                    <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
            </main>

            {!hideLayout && <Footer />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <AppLayout />
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;