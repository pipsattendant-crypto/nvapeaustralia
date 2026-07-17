import { Shield, Package, Truck, Clock } from 'lucide-react';
import './HeroBanner.css';

const BASE = 'https://nvapeaustralia-snh4.onrender.com/assets';

// Use confirmed working product images for the lineup
const LINEUP = [
  { src: `${BASE}/Blackberry-Ice-280x280.jpg`,     alt: 'GEEK BAR' },
  { src: `${BASE}/Kiwi-Pineapple-280x280.jpg`,     alt: 'IGET' },
  { src: `${BASE}/Blueberry-Blast-280x280.jpg`,    alt: 'NEXA' },
  { src: `${BASE}/Grape-Ice-280x280.jpg`,           alt: 'FUMOT' },
  { src: `${BASE}/Mango-Ice-280x280.jpg`,           alt: 'ALIBARBAR' },
];

const TRUST = [
  {
    icon: <Shield size={22} />,
    color: 'blue',
    title: '100% Delivery Protection',
    sub: 'Not delivered? Full compensation.',
  },
  {
    icon: <Package size={22} />,
    color: '',
    title: 'Direct Supply · Better Prices',
    sub: 'We source directly from manufacturers.',
  },
  {
    icon: <Truck size={22} />,
    color: '',
    title: '24hr Dispatch',
    sub: 'Orders before 2PM ship same business day.',
  },
  {
    icon: <Clock size={22} />,
    color: '',
    title: 'Fast Australia-Wide Delivery',
    sub: 'Standard 2–5 days · Express 1–3 days.',
  },
];

export default function HeroBanner() {
  return (
    <div className="hero-banner">
      {/* Red top bar */}
      <div className="hero-banner-top">
        <h2>
          Australia <span style={{ color: '#ffd700', textShadow: '2px 2px 0 rgba(0,0,0,.4)' }}>Wide Delivery</span>
          {' '}🇦🇺
        </h2>
      </div>

      {/* Body */}
      <div className="hero-banner-body">
        {/* Left – trust points */}
        <div className="hero-banner-left">
          {TRUST.map((t, i) => (
            <div key={i} className="hero-trust-item">
              <div className={`hero-trust-icon ${t.color}`}>{t.icon}</div>
              <div>
                <p className="hero-trust-title">{t.title}</p>
                <p className="hero-trust-sub">{t.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right – product lineup */}
        <div className="hero-banner-right">
          {LINEUP.map((p, i) => (
            <img
              key={i}
              src={p.src}
              alt={p.alt}
              className="hero-product-img"
              style={{
                marginLeft: i === 0 ? 0 : '-28px',
                zIndex: i,
                height: `${190 + i * 10}px`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
