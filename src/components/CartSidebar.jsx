import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import './CartSidebar.css';

export default function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, updateQty, removeFromCart, cartTotal } = useCart();
  const navigate = useNavigate();
  if (!isCartOpen) return null;

  const freeShipping = cartTotal >= 50;

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)} />
      <aside className="cart-sidebar animate-fade-in">
        <div className="cart-header flex justify-between items-center">
          <h2>Your Cart ({cartItems.length})</h2>
          <button onClick={() => setIsCartOpen(false)}><X size={22} /></button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart flex flex-col items-center justify-center gap-4">
              <span style={{fontSize:'3rem'}}>🛒</span>
              <p className="text-muted">Your cart is empty</p>
              <button className="btn btn-primary" onClick={() => setIsCartOpen(false)}>Shop Now</button>
            </div>
          ) : cartItems.map(item => (
            <div key={item.id} className="cart-item">
              <div className="flex gap-4 items-center">
                <div className="cart-item-img"><img src={item.image} alt={item.name} /></div>
                <div style={{flex:1}}>
                  <p style={{fontSize:'.875rem', fontWeight:600, lineHeight:1.3}}>{item.name}</p>
                  <p className="text-accent" style={{fontWeight:700, marginTop:'.25rem'}}>${(item.price * item.qty).toFixed(2)}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="qty-controls flex items-center">
                      <button onClick={() => updateQty(item.id, item.qty - 1)}><Minus size={14} /></button>
                      <span>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, item.qty + 1)}><Plus size={14} /></button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}><Trash2 size={15} /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            {!freeShipping && (
              <p className="text-sm text-muted mb-2">Add ${(50 - cartTotal).toFixed(2)} more for <strong className="text-success">FREE shipping</strong></p>
            )}
            {freeShipping && <p className="text-sm text-success mb-2">🎉 You qualify for FREE shipping!</p>}
            <div className="cart-total flex justify-between mb-4">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold text-accent">${cartTotal.toFixed(2)}</span>
            </div>
            <button className="btn btn-primary w-full" onClick={() => { setIsCartOpen(false); navigate('/checkout'); }}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
