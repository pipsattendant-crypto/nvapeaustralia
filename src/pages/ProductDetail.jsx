import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Shield, Truck, RefreshCw, Zap, ChevronRight, Minus, Plus } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import '../components/ProductCard.css';
import './ProductDetail.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const product = products.find(p => p.id === Number(id));
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return (
    <div className="not-found-container container">
      <h2>Product not found</h2>
      <Link to="/" className="btn btn-primary">Back to Shop</Link>
    </div>
  );

  const related = products.filter(p => p.brand === product.brand && p.id !== product.id).slice(0, 4);
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null;

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="product-detail-page">
      <div className="breadcrumb-bar">
        <div className="container breadcrumb">
          <Link to="/">Home</Link>
          <ChevronRight size={14} />
          <Link to="/?category=Disposables">{product.category}</Link>
          <ChevronRight size={14} />
          <span>{product.name}</span>
        </div>
      </div>

      <div className="container" style={{paddingTop:'2rem', paddingBottom:'2rem'}}>
        <div className="pd-layout">
          {/* Image */}
          <div className="pd-image-section">
            <div className="pd-image-wrapper">
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              <img src={product.image} alt={product.name} className="pd-image" />
            </div>
            <div className="pd-trust-badges">
              {[
                { icon:<Shield size={18}/>, text:'100% Genuine Product' },
                { icon:<Truck size={18}/>, text:'Fast Dispatch — Same Day if ordered before 2PM' },
                { icon:<RefreshCw size={18}/>, text:'7-Day Return Policy' },
                { icon:<Zap size={18}/>, text:'Secure Checkout' },
              ].map((t,i) => (
                <div key={i} className="trust-item flex items-center gap-4">
                  <span className="text-accent">{t.icon}</span>
                  <span className="text-sm text-muted">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-brand text-accent">{product.brand}</p>
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-rating flex items-center gap-2">
              <span style={{color:'#f5a623'}}>{'★'.repeat(Math.round(product.rating))}</span>
              <span className="text-sm text-muted">{product.rating} ({product.reviews} reviews)</span>
            </div>

            {product.puffs && (
              <div className="pd-puffs-tag">
                <Zap size={14} /> {product.puffs.toLocaleString()} Puffs
              </div>
            )}

            <p className="pd-description">{product.description}</p>

            {/* Specs */}
            <div className="pd-specs">
              {[
                ['Flavour', product.flavour],
                ['Nicotine', product.nicotine],
                ['Capacity', product.capacity],
                ['Battery', product.battery],
              ].map(([k,v]) => v && (
                <div key={k} className="spec-row">
                  <span className="spec-key">{k}</span>
                  <span className="spec-val">{v}</span>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="pd-price-block">
              <div className="pd-price-main">
                <span className="pd-price">${product.price.toFixed(2)}</span>
                <span className="pd-currency">AUD</span>
                {product.originalPrice && <span className="pd-original-price">${product.originalPrice.toFixed(2)}</span>}
              </div>
              {discount && <span className="pd-discount-tag">SAVE {discount}%</span>}
            </div>

            {/* Qty */}
            <div className="pd-qty-section">
              <span className="pd-label">Quantity:</span>
              <div className="pd-qty-controls flex items-center">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q-1))}><Minus size={16}/></button>
                <span className="qty-value">{qty}</span>
                <button className="qty-btn" onClick={() => setQty(q => q+1)}><Plus size={16}/></button>
              </div>
            </div>

            {/* Shipping preview */}
            <div className="pd-shipping-preview">
              <div className="ship-row"><Truck size={16}/> <span>FREE shipping on orders <strong>$50+</strong></span></div>
              <div className="ship-row"><Zap size={16}/> <span>Same-day dispatch on orders before <strong>2PM AEST</strong></span></div>
            </div>

            {/* Actions */}
            <div className="pd-actions">
              <button className={`btn pd-add-btn${added?' added':''}`} onClick={handleAdd}>
                <ShoppingCart size={18}/> {added ? '✓ Added!' : 'Add to Cart'}
              </button>
              <button className="btn btn-outline pd-checkout-btn" onClick={() => { addToCart(product, qty); navigate('/checkout'); }}>
                Buy Now
              </button>
            </div>
            <Link to="/" className="back-link text-muted">← Back to Products</Link>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="pd-related">
            <h2 className="section-title mb-8">More from {product.brand}</h2>
            <div className="products-grid">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
