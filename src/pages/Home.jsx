import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
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
      {/* Hero Banner */}
      {!isFiltering && <HeroBanner />}


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
            <div>
              <h2 className="section-title">
                {q ? `Search: "${q}"` : activeCategory !== 'All' ? activeCategory : `Brand: ${activeBrand}`}
              </h2>
              <p className="text-muted" style={{marginTop:'.25rem',fontSize:'.9rem'}}>{filtered.length} products found</p>
            </div>
            <button className="btn btn-secondary" style={{fontSize:'.85rem'}} onClick={() => { setActiveCategory('All'); setActiveBrand('All'); window.history.pushState({}, '', '/'); }}>
              ✕ Clear filters
            </button>
          </div>
        ) : (
          <div className="section-header">
            <div>
              <h2 className="section-title">Shop All Products</h2>
              <p className="text-muted" style={{marginTop:'.25rem',fontSize:'.9rem'}}>Browse our complete collection of premium vaping devices.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="filter-bar">
          <span className="filter-bar-label">Filter:</span>
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
