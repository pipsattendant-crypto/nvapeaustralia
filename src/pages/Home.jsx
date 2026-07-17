import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Truck, Shield, Star, Zap, RefreshCw, Award, ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products, reviews, brands } from '../data/products';
import '../components/ProductCard.css';
import './Home.css';

const HERO_IMG = 'https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=1400&q=80';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [filtered, setFiltered] = useState(products);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeBrand, setActiveBrand] = useState('All');
  const q = searchParams.get('q') || '';
  const urlCategory = searchParams.get('category') || '';
  const urlBrand = searchParams.get('brand') || '';

  useEffect(() => {
    if (urlCategory) setActiveCategory(urlCategory);
    if (urlBrand) setActiveBrand(urlBrand);
  }, [urlCategory, urlBrand]);

  useEffect(() => {
    let res = [...products];
    if (q) res = res.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.brand.toLowerCase().includes(q.toLowerCase()));
    if (activeCategory !== 'All') res = res.filter(p => p.category === activeCategory);
    if (activeBrand !== 'All') res = res.filter(p => p.brand === activeBrand);
    setFiltered(res);
  }, [q, activeCategory, activeBrand]);

  const isFiltering = q || activeCategory !== 'All' || activeBrand !== 'All';
  const bestSellers = products.filter(p => p.badge === 'BEST SELLER').slice(0, 4);
  const newArrivals = products.filter(p => p.badge === 'NEW').slice(0, 4);

  return (
    <div>
      {/* Hero */}
      {!isFiltering && (
        <section className="hero">
          <div className="hero-inner" style={{backgroundImage:`url(${HERO_IMG})`}}>
            <div className="hero-overlay" />
            <div className="hero-content container">
              <p className="hero-tag">🇦🇺 Australia's #1 Vape Store</p>
              <h1 className="hero-title">Premium Vapes<br/>Delivered Fast</h1>
              <p className="hero-sub">Shop 500+ products from top brands. Free shipping on orders $50+.</p>
              <div className="hero-btns">
                <a href="#products" className="btn btn-primary hero-btn">Shop Now <ChevronRight size={18}/></a>
                <a href="#brands" className="btn btn-secondary hero-btn">Browse Brands</a>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar */}
      {!isFiltering && (
        <section className="trust-bar">
          <div className="container trust-grid">
            {[
              { icon: <Truck size={22}/>, title:'Free Shipping', desc:'On orders $50+' },
              { icon: <Zap size={22}/>, title:'Same Day Dispatch', desc:'Order before 2PM' },
              { icon: <Shield size={22}/>, title:'Secure Payments', desc:'Bank transfer & crypto' },
              { icon: <RefreshCw size={22}/>, title:'Easy Returns', desc:'7-day return policy' },
              { icon: <Award size={22}/>, title:'Genuine Products', desc:'100% authentic brands' },
            ].map((f,i) => (
              <div key={i} className="trust-item">
                <div className="trust-icon">{f.icon}</div>
                <div>
                  <p className="trust-title">{f.title}</p>
                  <p className="trust-desc">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {!isFiltering && (
        <section className="section container" id="products">
          <div className="section-header">
            <h2 className="section-title">🔥 Best Sellers</h2>
            <a href="#all-products" className="view-all">View All <ChevronRight size={16}/></a>
          </div>
          <div className="products-grid">
            {bestSellers.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {!isFiltering && (
        <section className="section container new-banner">
          <div className="new-banner-inner">
            <div className="new-banner-text">
              <h2>🆕 New Arrivals</h2>
              <p>Fresh products just landed in our store. Be the first to try them!</p>
            </div>
          </div>
          <div className="products-grid" style={{marginTop:'1.5rem'}}>
            {newArrivals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* All Products / Search Results */}
      <section className="section container" id="all-products">
        {isFiltering ? (
          <div className="section-header">
            <h2 className="section-title">
              {q ? `Search: "${q}"` : activeCategory !== 'All' ? activeCategory : `Brand: ${activeBrand}`}
              <span className="result-count"> — {filtered.length} results</span>
            </h2>
            <button className="view-all" onClick={() => { setActiveCategory('All'); setActiveBrand('All'); window.history.pushState({}, '', '/'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="section-header">
            <h2 className="section-title">All Products</h2>
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-tabs">
            {['All','Disposables','Pod Kits','Liquids','Accessories'].map(cat => (
              <button key={cat} className={`filter-tab${activeCategory===cat?' active':''}`} onClick={() => setActiveCategory(cat)}>{cat}</button>
            ))}
          </div>
          <select className="brand-select" value={activeBrand} onChange={e => setActiveBrand(e.target.value)}>
            <option value="All">All Brands</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="no-results">
            <p style={{fontSize:'3rem'}}>😕</p>
            <h3>No products found</h3>
            <p className="text-muted">Try a different search or browse all products.</p>
            <button className="btn btn-primary" onClick={() => { setActiveCategory('All'); setActiveBrand('All'); }}>View All Products</button>
          </div>
        ) : (
          <div className="products-grid animate-fade-in">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Brands Section */}
      {!isFiltering && (
        <section className="section container" id="brands">
          <h2 className="section-title text-center mb-8">Shop By Brand</h2>
          <div className="brands-grid">
            {brands.map(b => (
              <button key={b} className="brand-pill" onClick={() => { setActiveBrand(b); document.getElementById('all-products')?.scrollIntoView({behavior:'smooth'}); }}>
                {b}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Reviews */}
      {!isFiltering && (
        <section className="section container">
          <div className="section-header mb-8">
            <div>
              <h2 className="section-title">Customer Reviews</h2>
              <div className="trustpilot-row">
                <span style={{color:'#00b67a', fontWeight:700}}>★★★★★</span>
                <span className="text-sm text-muted">4.8/5 based on 1,200+ reviews</span>
              </div>
            </div>
          </div>
          <div className="reviews-grid">
            {reviews.map(r => (
              <div key={r.id} className="review-card">
                <div className="flex justify-between items-center mb-2">
                  <div className="star-rating">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                  <span className="text-sm text-muted">{r.date}</span>
                </div>
                <p style={{fontSize:'.9rem', lineHeight:1.6, marginBottom:'.75rem'}}>"{r.text}"</p>
                <div>
                  <p style={{fontWeight:600, fontSize:'.875rem'}}>{r.name}</p>
                  <p className="text-sm text-muted">{r.location} · {r.product}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
