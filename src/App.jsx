import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import FloatingWidgets from './components/FloatingWidgets';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import TrackOrder from './pages/TrackOrder';
import Shipping from './pages/Shipping';
import Login from './pages/Login';
import Account from './pages/Account';

function NotFound() {
  return (
    <div style={{textAlign:'center', padding:'6rem 1rem'}}>
      <p style={{fontSize:'4rem'}}>😕</p>
      <h2 style={{fontSize:'2rem', fontWeight:700, margin:'1rem 0'}}>Page Not Found</h2>
      <a href="/" className="btn btn-primary" style={{display:'inline-flex', marginTop:'1rem'}}>Back to Shop</a>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Header />
          <CartSidebar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track" element={<TrackOrder />} />
              <Route path="/shipping" element={<Shipping />} />
              <Route path="/login" element={<Login />} />
              <Route path="/account" element={<Account />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <FloatingWidgets />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
