import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="brand-logo">N<span>VAPE</span></div>
            <div className="brand-sub">AUSTRALIA</div>
            <p className="footer-desc">Australia's #1 online vape store. Premium disposables, pod kits and e-liquids delivered fast to your door.</p>
            <div className="footer-social">
              <a href="https://t.me/nvapeaustralia" target="_blank" rel="noreferrer" className="social-link">Telegram</a>
              <a href="https://wa.me/61400000000" target="_blank" rel="noreferrer" className="social-link">WhatsApp</a>
            </div>
          </div>

          <div className="footer-links">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/?category=Disposables">Disposables</Link></li>
              <li><Link to="/?category=Pod Kits">Pod Kits</Link></li>
              <li><Link to="/?category=Liquids">E-Liquids</Link></li>
              <li><Link to="/?category=Accessories">Accessories</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Help</h4>
            <ul>
              <li><Link to="/track">Track Order</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:support@nvapeaustralia.com">support@nvapeaustralia.com</a></li>
              <li><a href="https://t.me/nvapeaustralia" target="_blank" rel="noreferrer">Telegram Support</a></li>
              <li><span className="text-muted">Mon–Fri 9am–6pm AEST</span></li>
            </ul>
            <div className="payment-icons">
              <span>💳</span><span>🏦</span><span>💰</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom border-t">
          <p className="text-muted text-sm">© 2024 NVape Australia. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy" className="text-sm text-muted">Privacy Policy</Link>
            <Link to="/terms" className="text-sm text-muted">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
