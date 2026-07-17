import { useState, useEffect, useRef } from 'react';
import { Shield, Package, Truck, Clock, Star, CheckCircle, Zap, Award } from 'lucide-react';
import './HeroBanner.css';

const BASE = 'https://nvapeaustralia-snh4.onrender.com/assets';

const PRODUCTS = [
  { src: `${BASE}/Blue-Razz-Lemonade-247x296.jpg`,   name: 'IGET Bar Plus',         brand: 'IGET' },
  { src: `${BASE}/Cola-Ice-247x296.jpg`,             name: 'IGET Cola Ice',          brand: 'IGET' },
  { src: `${BASE}/Blueberry-Blast-280x280.jpg`,      name: 'NEXA Blueberry Blast',   brand: 'NEXA' },
  { src: `${BASE}/Blackberry-Ice-280x280.jpg`,       name: 'GEEK BAR Blackberry',    brand: 'GEEK BAR' },
  { src: `${BASE}/Kiwi-Pineapple-280x280.jpg`,       name: 'SMOK Kiwi Pineapple',    brand: 'SMOK' },
  { src: `${BASE}/Grape-Ice-280x280.jpg`,            name: 'Fumot Grape Ice',        brand: 'FUMOT' },
  { src: `${BASE}/Mango-Ice-280x280.jpg`,            name: 'Alibarbar Mango Ice',    brand: 'ALIBARBAR' },
  { src: `${BASE}/Strawberry-Watermelon-280x280.jpg`,name: 'Elf Bar Strawberry WM',  brand: 'ELF BAR' },
];

const TRUST = [
  { icon: <Shield size={20} />, cls: 'icon-orange', title: '100% Delivery Protection', sub: 'Not delivered? Full compensation.' },
  { icon: <Package size={20} />, cls: 'icon-blue',   title: 'Direct Supply · Better Prices', sub: 'We source directly from manufacturers.' },
  { icon: <Truck size={20} />,  cls: 'icon-green',  title: '24hr Dispatch', sub: 'Orders before 2PM ship same business day.' },
  { icon: <Clock size={20} />,  cls: 'icon-purple', title: 'Fast Australia-Wide Delivery', sub: 'Standard 2–5 days · Express 1–3 days.' },
];

const MARQUEE_ITEMS = [
  { icon: <CheckCircle size={14} />, text: 'Free Shipping $50+' },
  { icon: <Zap size={14} />,         text: 'Same Day Dispatch' },
  { icon: <Shield size={14} />,      text: '100% Authentic' },
  { icon: <Star size={14} />,        text: '4.9★ Rating' },
  { icon: <Award size={14} />,       text: 'Premium Brands' },
  { icon: <Truck size={14} />,       text: 'Tracked Delivery' },
  { icon: <CheckCircle size={14} />, text: '7-Day Returns' },
  { icon: <Package size={14} />,     text: 'Discreet Packaging' },
];

// Animated counter hook
function useCounter(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// Determine position class for each product
function getPositionClass(index, active, total) {
  const diff = (index - active + total) % total;
  if (diff === 0) return 'active';
  if (diff === 1) return 'right-1';
  if (diff === 2) return 'right-2';
  if (diff === total - 1) return 'left-1';
  if (diff === total - 2) return 'left-2';
  return 'hidden';
}

export default function HeroBanner() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [started, setStarted] = useState(false);
  const timerRef = useRef(null);

  // Auto-rotate
  useEffect(() => {
    setStarted(true);
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % PRODUCTS.length);
    }, 2800);
    return () => clearInterval(timerRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveIdx(i => (i + 1) % PRODUCTS.length);
    }, 2800);
  };

  const c1 = useCounter(15000, 1800, started);
  const c2 = useCounter(500, 1600, started);
  const c3 = useCounter(98, 1400, started);

  // Build doubled marquee items for seamless loop
  const marqueeItems = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="hero-banner">

      {/* ── Animated "Australia Wide Delivery" ticker top ── */}
      <div className="delivery-ticker">
        <div className="delivery-ticker-inner">
          {[...Array(4)].map((_, k) => (
            <span key={k} className="ticker-title">
              🇦🇺 AUSTRALIA <span>WIDE DELIVERY</span> &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Main body ── */}
      <div className="hero-banner-body">

        {/* Left – trust + stats */}
        <div className="hero-banner-left">
          {TRUST.map((t, i) => (
            <div key={i} className="hero-trust-item">
              <div className={`hero-trust-icon-wrap ${t.cls}`}>{t.icon}</div>
              <div>
                <p className="hero-trust-title">{t.title}</p>
                <p className="hero-trust-sub">{t.sub}</p>
              </div>
            </div>
          ))}

          {/* Animated stats row */}
          <div className="hero-stats-row">
            <div className="hero-stat">
              <div className="hero-stat-num">{c1.toLocaleString()}+</div>
              <div className="hero-stat-label">Happy Customers</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{c2}+</div>
              <div className="hero-stat-label">Products</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-num">{c3}%</div>
              <div className="hero-stat-label">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Right – rotating product showcase */}
        <div className="hero-banner-right">
          <div className="hero-product-stage">
            {PRODUCTS.map((p, i) => {
              const pos = getPositionClass(i, activeIdx, PRODUCTS.length);
              if (pos === 'hidden') return null;
              return (
                <div
                  key={i}
                  className={`hero-prod ${pos}`}
                  onClick={() => { setActiveIdx(i); resetTimer(); }}
                >
                  <span className="hero-prod-label">{p.brand}</span>
                  <img src={p.src} alt={p.name} loading="lazy" />
                </div>
              );
            })}
          </div>

          {/* Dot navigation */}
          <div className="hero-dots">
            {PRODUCTS.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === activeIdx ? ' active' : ''}`}
                onClick={() => { setActiveIdx(i); resetTimer(); }}
                aria-label={`Product ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom marquee trust ticker ── */}
      <div className="trust-marquee">
        <div className="trust-marquee-inner">
          {marqueeItems.map((item, i) => (
            <>
              <span key={i} className="trust-marquee-item">
                {item.icon} {item.text}
              </span>
              <span key={`sep-${i}`} className="trust-marquee-sep">★</span>
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
