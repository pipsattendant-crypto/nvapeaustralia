import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Package, Truck, CheckCircle, ChevronLeft } from 'lucide-react';
import { getOrderByRef } from '../context/AuthContext';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [ref, setRef] = useState(searchParams.get('ref') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (searchParams.get('ref')) {
      handleSearch();
    }
  }, []);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (!ref.trim()) return;
    
    setSearched(true);
    const found = getOrderByRef(ref.trim());
    if (found) {
      setOrder(found);
      setError('');
    } else {
      setOrder(null);
      setError('Order not found. Please check your reference number and try again.');
    }
  };

  return (
    <div className="track-page min-h-screen" style={{ background: '#f7f7f7', padding: '4rem 1rem' }}>
      <div className="container" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button onClick={() => navigate(-1)} style={{ display: 'flex', alignItems: 'center', gap: '.25rem', color: '#666', background: 'none', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', fontWeight: 600 }}>
          <ChevronLeft size={16} /> Back
        </button>
        
        <div style={{ background: '#fff', borderRadius: '12px', padding: '2.5rem', border: '1px solid #eaeaea', boxShadow: '0 4px 20px rgba(0,0,0,.03)' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '.5rem', textAlign: 'center' }}>Track Your Order</h1>
          <p style={{ color: '#666', textAlign: 'center', marginBottom: '2rem' }}>Enter your order reference number (e.g., NVP-123456) to check its status.</p>

          <form onSubmit={handleSearch} style={{ display: 'flex', gap: '.5rem', marginBottom: '2rem' }}>
            <input 
              type="text" 
              className="input" 
              placeholder="Order Reference (NVP-...)" 
              value={ref} 
              onChange={e => setRef(e.target.value)} 
              required
              style={{ flex: 1, padding: '.8rem 1rem' }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0 1.5rem' }}>
              <Search size={18} />
            </button>
          </form>

          {error && (
            <div style={{ background: 'rgba(210,19,19,.1)', border: '1px solid rgba(210,19,19,.3)', borderRadius: '8px', padding: '1rem', color: 'var(--accent)', fontSize: '.9rem', textAlign: 'center' }}>
              {error}
            </div>
          )}

          {order && (
            <div className="order-status-card animate-slide-up" style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                <div>
                  <p style={{ fontSize: '.85rem', color: '#666', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 700 }}>Order Reference</p>
                  <p style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>{order.ref}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: '.85rem', color: '#666' }}>Placed On</p>
                  <p style={{ fontWeight: 600 }}>{new Date(order.date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Status Timeline */}
              <div style={{ position: 'relative', margin: '2.5rem 0 1.5rem' }}>
                <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '3px', background: '#eee', zIndex: 0 }}>
                  <div style={{ height: '100%', background: 'var(--accent)', width: order.status === 'Processing' ? '0%' : order.status === 'Shipped' ? '50%' : '100%', transition: 'width .5s' }} />
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                  {/* Placed */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', width: '33%' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px #fff' }}>
                      <Package size={18} />
                    </div>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, color: '#333' }}>Order Placed</p>
                  </div>
                  
                  {/* Shipped */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', width: '33%' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: order.status === 'Shipped' || order.status === 'Delivered' ? 'var(--accent)' : '#eee', color: order.status === 'Shipped' || order.status === 'Delivered' ? '#fff' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px #fff', transition: 'all .3s' }}>
                      <Truck size={18} />
                    </div>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, color: order.status === 'Shipped' || order.status === 'Delivered' ? '#333' : '#999' }}>Shipped</p>
                  </div>
                  
                  {/* Delivered */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.5rem', width: '33%' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: order.status === 'Delivered' ? '#10b981' : '#eee', color: order.status === 'Delivered' ? '#fff' : '#aaa', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px #fff', transition: 'all .3s' }}>
                      <CheckCircle size={18} />
                    </div>
                    <p style={{ fontSize: '.75rem', fontWeight: 700, color: order.status === 'Delivered' ? '#333' : '#999' }}>Delivered</p>
                  </div>
                </div>
              </div>

              <div style={{ background: '#f9f9f9', borderRadius: '8px', padding: '1.25rem', marginTop: '2rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '1rem', paddingBottom: '.5rem', borderBottom: '1px solid #eee' }}>Order Details</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem' }}>
                      <span><span style={{ color: '#888' }}>{item.qty}x</span> {item.name}</span>
                      <span style={{ fontWeight: 600 }}>${(item.price * item.qty).toFixed(2)}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.9rem', marginTop: '.5rem', paddingTop: '.5rem', borderTop: '1px solid #eee', fontWeight: 700 }}>
                    <span>Total</span>
                    <span style={{ color: 'var(--accent)' }}>${order.total.toFixed(2)} AUD</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '.85rem', color: '#666' }}>Need help with this order?</p>
                <a href={`https://wa.me/61400000000?text=Hi! I need help with order ${order.ref}`} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '.5rem', color: 'var(--accent)', fontWeight: 600, textDecoration: 'none' }}>Contact Support via WhatsApp</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
