import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, ChevronDown, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { brands } from '../data/products';
import './Header.css';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();
  const [showBrands, setShowBrands] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) navigate(`/?q=${encodeURIComponent(searchVal.trim())}`);
  };

  return (
    <header className={`site-header${scrolled ? ' scrolled' : ''}`}>
      <div className="header-top container">
        <div className="h-login">
          <Link to="/login" className="login-link">Login / Register</Link>
        </div>
        <div className="h-logo">
          <Link to="/" className="logo-link">
            <div className="logo-text">N<span>VAPE</span></div>
            <div className="logo-sub">AUSTRALIA</div>
          </Link>
        </div>
        <div className="h-search">
          <form className="search-form" onSubmit={handleSearch}>
            <input
              className="search-input"
              placeholder="Search products..."
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
            <button type="submit" className="search-btn"><Search size={16} /></button>
          </form>
        </div>
      </div>

      <nav className="navbar-bottom">
        <div className="container nav-inner">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/?category=Disposables">Disposables</Link></li>
            <li>
              <div className="brands-dropdown-container" onMouseEnter={() => setShowBrands(true)} onMouseLeave={() => setShowBrands(false)}>
                <button className="brands-dropdown-trigger">
                  Brands <ChevronDown size={14} />
                </button>
                {showBrands && (
                  <ul className="brands-dropdown">
                    {brands.map(b => (
                      <li key={b}><Link to={`/?brand=${encodeURIComponent(b)}`} onClick={() => setShowBrands(false)}>{b}</Link></li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
            <li><Link to="/shipping">Shipping</Link></li>
            <li><Link to="/track">Track Order</Link></li>
          </ul>
          <button className="cart-total-btn" onClick={() => setIsCartOpen(true)}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </nav>
    </header>
  );
}
