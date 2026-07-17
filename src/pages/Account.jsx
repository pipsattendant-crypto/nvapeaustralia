import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, User, LogOut, ExternalLink, ChevronRight } from 'lucide-react';
import { useAuth, getOrdersByUser } from '../context/AuthContext';
import './Account.css';

export default function Account() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setOrders(getOrdersByUser(user.email));
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="account-page min-h-screen" style={{ background: '#f7f7f7', padding: '3rem 1rem' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '2rem' }}>My Account</h1>

        <div className="account-layout" style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <div className="account-sidebar" style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #eaeaea', height: 'fit-content' }}>
            <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontWeight: 700, lineHeight: 1.2 }}>{user.name}</p>
                <p style={{ fontSize: '.8rem', color: '#666' }}>{user.email}</p>
              </div>
            </div>

            <nav className="account-nav" style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
              <button 
                className={`account-nav-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'orders' ? 'rgba(210,19,19,.08)' : 'transparent', color: activeTab === 'orders' ? 'var(--accent)' : '#444', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
              >
                <Package size={18} /> Order History
              </button>
              <button 
                className={`account-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', borderRadius: '8px', border: 'none', background: activeTab === 'profile' ? 'rgba(210,19,19,.08)' : 'transparent', color: activeTab === 'profile' ? 'var(--accent)' : '#444', fontWeight: 600, cursor: 'pointer', textAlign: 'left', transition: 'all .2s' }}
              >
                <User size={18} /> Profile Details
              </button>
              <button 
                onClick={() => { logout(); navigate('/'); }}
                style={{ display: 'flex', alignItems: 'center', gap: '.75rem', padding: '.75rem 1rem', borderRadius: '8px', border: 'none', background: 'transparent', color: '#666', fontWeight: 600, cursor: 'pointer', textAlign: 'left', marginTop: '1rem', borderTop: '1px solid #eee' }}
              >
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="account-content">
            {activeTab === 'orders' && (
              <div className="account-card" style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #eaeaea' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '.75rem', borderBottom: '1px solid #eee' }}>Order History</h2>
                
                {orders.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <Package size={48} style={{ color: '#ccc', margin: '0 auto 1rem' }} />
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '.5rem' }}>No orders yet</h3>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>When you place orders, they will appear here.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>Start Shopping</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {orders.map(order => (
                      <div key={order.ref} className="order-history-card" style={{ border: '1px solid #eee', borderRadius: '8px', padding: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                          <div>
                            <p style={{ fontWeight: 700, color: 'var(--accent)', marginBottom: '.25rem' }}>Order #{order.ref}</p>
                            <p style={{ fontSize: '.85rem', color: '#666' }}>{new Date(order.date).toLocaleDateString()} · {order.items.length} items</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, fontSize: '1.1rem' }}>${order.total.toFixed(2)}</p>
                            <span style={{ display: 'inline-block', padding: '.25rem .75rem', background: '#fff9c4', color: '#f57f17', borderRadius: '20px', fontSize: '.75rem', fontWeight: 700, marginTop: '.25rem' }}>{order.status || 'Processing'}</span>
                          </div>
                        </div>
                        
                        <div style={{ background: '#fafafa', padding: '1rem', borderRadius: '6px', fontSize: '.85rem' }}>
                          <p style={{ fontWeight: 600, marginBottom: '.5rem' }}>Items:</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '.25rem 0', borderBottom: idx !== order.items.length -1 ? '1px solid #eee' : 'none' }}>
                              <span>{item.qty}x {item.name}</span>
                              <span style={{ color: '#666' }}>${(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        
                        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                          <button 
                            onClick={() => navigate(`/track?ref=${order.ref}`)}
                            style={{ display: 'flex', alignItems: 'center', gap: '.25rem', color: 'var(--accent)', background: 'none', border: 'none', fontSize: '.85rem', fontWeight: 600, cursor: 'pointer' }}
                          >
                            Track Order <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="account-card" style={{ background: '#fff', borderRadius: '12px', padding: '2rem', border: '1px solid #eaeaea' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem', paddingBottom: '.75rem', borderBottom: '1px solid #eee' }}>Profile Details</h2>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#666', marginBottom: '.25rem' }}>Full Name</label>
                    <input type="text" className="input" value={user.name} disabled style={{ background: '#f5f5f5', color: '#555' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#666', marginBottom: '.25rem' }}>Email Address</label>
                    <input type="email" className="input" value={user.email} disabled style={{ background: '#f5f5f5', color: '#555' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 600, color: '#666', marginBottom: '.25rem' }}>Account Created</label>
                    <input type="text" className="input" value={new Date(user.createdAt).toLocaleDateString()} disabled style={{ background: '#f5f5f5', color: '#555' }} />
                  </div>
                  
                  <p style={{ fontSize: '.85rem', color: '#888', marginTop: '1rem' }}>
                    To update your details or change your password, please contact support.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
