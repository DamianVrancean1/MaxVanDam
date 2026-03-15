import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import {CartProvider} from './context/CartContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import Cart from './pages/Cart';
import Unauthorized401 from './pages/Unauthorized401';
import Forbidden403 from './pages/Forbidden403';
import NotFound404 from './pages/NotFound404';
import './styles/App.css';

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <div className="app">
                        <Header/>
                        <main className="main-content">
                            <Routes>
                                <Route path="/" element={<Home/>}/>
                                <Route path="/products" element={<Products/>}/>
                                <Route path="/product/:id" element={<ProductDetail/>}/>
                                <Route path="/login" element={<Login/>}/>
                                <Route path="/401" element={<Unauthorized401/>}/>
                                <Route path="/403" element={<Forbidden403/>}/>
                                <Route path="/404" element={<NotFound404/>}/>
                                <Route
                                    path="/cart"
                                    element={
                                        <ProtectedRoute>
                                            <Cart/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AdminDashboard/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/add-product"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <AddProduct/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/edit-product/:id"
                                    element={
                                        <ProtectedRoute requireAdmin>
                                            <EditProduct/>
                                        </ProtectedRoute>
                                    }
                                />
                                <Route path="*" element={<Navigate to="/404" replace/>}/>
                            </Routes>
                        </main>
                        <Footer/>
                    </div>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
