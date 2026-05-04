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
import Unauthorized401 from './pages/Unauthorized401';
import Forbidden403 from './pages/Forbidden403';
import NotFound404 from './pages/NotFound404';
import AdminApp from './admin/AdminApp';
import About from './pages/About';
import Register from './pages/Register';
import InventoryVisibility from './pages/InventoryVisibility';
import DetailedInfoShowcase from './pages/DetailedInfoShowcase';
import SmartOrganizationShowcase from './pages/SmartOrganizationShowcase';
import SubscriptionsInfo from './pages/SubscriptionsInfo';
import SubscriptionsPage from './pages/Subscriptions';
import Pricing from './pages/Pricing';
import PricingPlanDetails from './pages/PricingPlanDetails';
import PricingContact from './pages/PricingContact';
import './styles/App.css';

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isShowcaseRoute =
    location.pathname.startsWith('/inventory-visibility') ||
    location.pathname.startsWith('/informatii-detaliate') ||
    location.pathname.startsWith('/organizare-inteligenta');
  const hideChrome = isAdminRoute || isAuthRoute || isShowcaseRoute;

  return (
    <div className="app">
      {!hideChrome && <Header />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
          <Route path="/subscriptions" element={<SubscriptionsPage />} />
          <Route path="/subscriptions-info" element={<SubscriptionsInfo />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/pricing/:planId/details" element={<PricingPlanDetails />} />
          <Route path="/pricing/:planId/contact" element={<PricingContact />} />
          <Route path="/inventory-visibility" element={<InventoryVisibility />} />
          <Route path="/informatii-detaliate" element={<DetailedInfoShowcase />} />
          <Route path="/organizare-inteligenta" element={<SmartOrganizationShowcase />} />
          <Route path="/401" element={<Unauthorized401 />} />
          <Route path="/403" element={<Forbidden403 />} />
          <Route path="/404" element={<NotFound404 />} />
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
      {!hideChrome && <Footer />}
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
