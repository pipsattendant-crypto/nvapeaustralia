import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-container">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <div className="product-overlay">
          <span className="quick-view-hint"><Eye size={14} /> Quick View</span>
        </div>
      </Link>
      <div className="product-info">
        <span className="product-category">{product.brand}</span>
        <Link to={`/product/${product.id}`} className="product-name">{product.name}</Link>
        <div className="product-footer">
          <div className="flex items-center gap-2">
            <span className="product-price">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span style={{color:'var(--text2)', fontSize:'.85rem', textDecoration:'line-through'}}>${product.originalPrice.toFixed(2)}</span>
            )}
            {discount && <span className="discount-badge">-{discount}%</span>}
          </div>
          <button className="btn btn-primary add-to-cart-btn" onClick={(e) => {
            e.preventDefault(); // prevent link navigation if placed inside one
            addToCart(product);
            addToast(`Added ${product.name} to cart`);
          }}>
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
