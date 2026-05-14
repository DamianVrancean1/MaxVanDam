import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigationType } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
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
import DemoApp from './demo/DemoApp';
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
import CheckoutPage from './pages/CheckoutPage';
import './styles/App.css';
import './styles/ix-design-system.css';
import { initBackground } from './lib/background3d';
import { animatePageLoad, initScrollReveal, animateStatusDot } from './lib/animations';

const AppLayout = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const isDemoRoute = location.pathname.startsWith('/ui-demo');

  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
  const isShowcaseRoute =
    location.pathname.startsWith('/inventory-visibility') ||
    location.pathname.startsWith('/informatii-detaliate') ||
    location.pathname.startsWith('/organizare-inteligenta');
  const hideChrome = isAdminRoute || isAuthRoute || isShowcaseRoute;

  // Three.js background — init once on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const cleanup = initBackground(canvasRef.current);
    cleanupRef.current = cleanup;
    return () => cleanup();
  }, []);

  // GSAP: re-run on every route change (skip for demo)
  useEffect(() => {
    if (isDemoRoute) return;
    const tl = animatePageLoad();
    const revealTimer = setTimeout(() => initScrollReveal(), 120);
    animateStatusDot();
    return () => {
      tl.kill();
      clearTimeout(revealTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, navType]);

  /* ── Demo: render completely standalone, outside app chrome ── */
  if (isDemoRoute) {
    return (
      <Routes>
        <Route path="/ui-demo/*" element={<DemoApp />} />
        <Route path="*" element={<Navigate to="/ui-demo/dashboard" replace />} />
      </Routes>
    );
  }

  /* ── Main app ── */
  return (
    <div className="app ix-app">
      {/* Three.js background canvas */}
      <canvas ref={canvasRef} id="ix-bg-canvas" className="ix-bg-canvas" aria-hidden="true" />
      {/* Film grain overlay for premium texture */}
      <div className="ix-grain-overlay" aria-hidden="true" />

      {!hideChrome && <Header />}
      <main className="main-content ix-main">
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
          <Route path="/pricing/:planId/checkout" element={<CheckoutPage />} />
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
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <AppLayout />
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
