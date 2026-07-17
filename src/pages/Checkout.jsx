import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth, saveOrder } from '../context/AuthContext';
import { Shield, Truck, Copy, Check, ChevronLeft } from 'lucide-react';
import './Checkout.css';

const STEPS = ['Cart', 'Details', 'Payment', 'Confirm'];

const BANK = {
  'Bank Name': 'Commonwealth Bank of Australia',
  'Account Name': 'NVape Australia Pty Ltd',
  'BSB': '062-000',
  'Account Number': '1234 5678',
};

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState('bank');
  const [copied, setCopied] = useState({});
  const [form, setForm] = useState({ 
    firstName: user ? user.name.split(' ')[0] : '', 
    lastName: user && user.name.split(' ').length > 1 ? user.name.split(' ').slice(1).join(' ') : '', 
    email: user ? user.email : '', 
    phone: '', address: '', suburb: '', state: '', postcode: '' 
  });
  const [orderRef] = useState(`NVP-${Date.now().toString().slice(-6)}`);

  const FREE_SHIP = cartTotal >= 50;
  const shipping = FREE_SHIP ? 0 : 9.99;
  const total = cartTotal + shipping;

  const copyVal = (key, val) => {
    navigator.clipboard.writeText(val);
    setCopied(p => ({...p, [key]:true}));
    setTimeout(() => setCopied(p => ({...p, [key]:false})), 2000);
  };

  const handleSubmit = (e) => { e.preventDefault(); setStep(2); };

  const handlePlaceOrder = () => {
    saveOrder({
      ref: orderRef,
      email: form.email.toLowerCase(),
      total,
      date: new Date().toISOString(),
      items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
      status: 'Processing',
      shipping: form,
      method
    });
    clearCart();
    setStep(3);
  };

  if (cartItems.length === 0 && step < 3) return (
    <div className="checkout-page container" style={{textAlign:'center', padding:'5rem 1rem'}}>
      <p style={{fontSize:'3rem'}}>🛒</p>
      <h2>Your cart is empty</h2>
      <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={() => navigate('/')}>Shop Now</button>
    </div>
  );

  // Order Summary Panel
  const Summary = () => (
    <div className="order-summary-panel">
      <h3 style={{fontWeight:700, marginBottom:'.75rem'}}>Order Summary</h3>
      <div className="summary-items">
        {cartItems.map(item => (
          <div key={item.id} className="summary-item">
            <div className="summary-img">
              <img src={item.image} alt={item.name} />
              <span className="summary-qty-badge">{item.qty}</span>
            </div>
            <div className="summary-item-info">
              <p className="summary-item-name">{item.name}</p>
              <p className="summary-item-price">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2" style={{fontSize:'.9375rem'}}>
        <div className="flex justify-between text-muted"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></div>
        <div className="flex justify-between">
          <span className="text-muted">Shipping</span>
          <span className={FREE_SHIP ? 'text-success font-bold' : ''}>{FREE_SHIP ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
        </div>
        {!FREE_SHIP && <p className="ship-note">Add ${(50 - cartTotal).toFixed(2)} for free shipping</p>}
        <div className="summary-total"><span>Total</span><span className="text-accent">${total.toFixed(2)} AUD</span></div>
      </div>
      <div className="summary-trust flex flex-col gap-2">
        {[<><Shield size={14}/> Secure & encrypted checkout</>, <><Truck size={14}/> Fast & tracked delivery</>, <><Shield size={14}/> 7-day return policy</>].map((t,i) => (
          <div key={i} className="trust-row flex items-center gap-2 text-muted text-sm">{t}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="checkout-page">
      <div className="container" style={{paddingTop:'2rem', paddingBottom:'4rem'}}>
        {/* Steps */}
        <div className="checkout-steps">
          {STEPS.map((s,i) => (
            <div key={s} className="flex items-center">
              <div className={`step-pill${step===i?' active':''}${step>i?' done':''}`}>
                <span className="step-num">{step>i ? '✓' : i+1}</span> {s}
              </div>
              {i < STEPS.length-1 && <div className={`step-connector${step>i?' done':''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          {/* Left Panel */}
          <div>
            {/* Step 1: Details */}
            {step === 1 && (
              <form className="checkout-card" onSubmit={handleSubmit}>
                <h2 className="section-title">Shipping Details</h2>
                <div className="form-row">
                  <div className="form-group"><label>First Name</label><input className="input" required value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} /></div>
                  <div className="form-group"><label>Last Name</label><input className="input" required value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email</label><input className="input" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} /></div>
                  <div className="form-group"><label>Phone</label><input className="input" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} /></div>
                </div>
                <div className="form-group"><label>Address</label><input className="input" required value={form.address} onChange={e=>setForm(p=>({...p,address:e.target.value}))} /></div>
                <div className="form-row three">
                  <div className="form-group"><label>Suburb</label><input className="input" required value={form.suburb} onChange={e=>setForm(p=>({...p,suburb:e.target.value}))} /></div>
                  <div className="form-group"><label>State</label>
                    <select className="input" required value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))}>
                      <option value="">Select</option>
                      {['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s=><option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Postcode</label><input className="input" required maxLength={4} value={form.postcode} onChange={e=>setForm(p=>({...p,postcode:e.target.value}))} /></div>
                </div>
                <button type="submit" className="btn btn-primary next-btn">Continue to Payment →</button>
              </form>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="checkout-card">
                <h2 className="section-title">Payment Method</h2>
                <div className="method-grid">
                  {[{id:'bank', label:'Bank Transfer', sub:'Direct deposit'}, {id:'crypto', label:'Crypto', sub:'BTC / ETH / USDT'}, {id:'whatsapp', label:'WhatsApp', sub:'Pay on contact'}].map(m => (
                    <div key={m.id} className={`method-card${method===m.id?' selected':''}`} onClick={() => setMethod(m.id)}>
                      <div className="method-radio" />
                      <div style={{fontSize:'1.5rem'}}>{m.id==='bank'?'🏦':m.id==='crypto'?'₿':'💬'}</div>
                      <p className="method-label">{m.label}</p>
                      <p className="method-sub">{m.sub}</p>
                    </div>
                  ))}
                </div>

                {method === 'bank' && (
                  <div className="payment-info-box">
                    <p className="pay-info-title">Bank Transfer Details</p>
                    <p className="pay-info-note text-muted">Transfer the total amount to the account below. Use your order reference <strong style={{color:'var(--accent)'}}>{orderRef}</strong> as the payment description.</p>
                    <div className="bank-details">
                      {Object.entries(BANK).map(([k,v]) => (
                        <div key={k} className="bank-row">
                          <span className="bank-label">{k}</span>
                          <div className="flex items-center gap-2">
                            <span className="bank-value">{v}</span>
                            <button className="copy-btn" onClick={() => copyVal(k,v)}>{copied[k] ? <Check size={14}/> : <Copy size={14}/>}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {method === 'crypto' && (
                  <div className="payment-info-box">
                    <p className="pay-info-title">Cryptocurrency Payment</p>
                    <p className="pay-info-note text-muted">We accept BTC, ETH and USDT (TRC20/ERC20). After placing your order, we'll send your wallet address via WhatsApp or Telegram.</p>
                    <a href="https://wa.me/61400000000" target="_blank" rel="noreferrer" className="whatsapp-cta">💬 Contact via WhatsApp for Wallet Address</a>
                  </div>
                )}

                {method === 'whatsapp' && (
                  <div className="payment-info-box">
                    <p className="pay-info-title">WhatsApp Order</p>
                    <p className="pay-info-note text-muted">Click below to send your order details to our team via WhatsApp. We'll confirm your order and arrange payment.</p>
                    <a href={`https://wa.me/61400000000?text=Hi! I'd like to place an order. Ref: ${orderRef}. Total: $${total.toFixed(2)} AUD`} target="_blank" rel="noreferrer" className="whatsapp-cta">💬 Send Order via WhatsApp</a>
                  </div>
                )}

                <div className="flex justify-between items-center" style={{marginTop:'1rem'}}>
                  <button className="back-link flex items-center gap-1 text-muted" onClick={() => setStep(1)}><ChevronLeft size={16}/> Back</button>
                  <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order →</button>
                </div>
                <p className="secure-note flex items-center justify-center gap-2 text-muted text-sm"><Shield size={14}/> Your information is secure and encrypted</p>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="confirmation-screen">
                <div style={{fontSize:'4rem'}}>🎉</div>
                <h2 style={{fontWeight:700, fontSize:'2rem'}}>Order Placed!</h2>
                <p className="text-muted" style={{fontSize:'1rem', lineHeight:1.6}}>Thank you for your order! Your reference is <strong style={{color:'var(--accent)'}}>{orderRef}</strong>.</p>
                <div className="conf-alert" style={{ background: '#e6f7ed', color: '#0d6538', border: '1px solid #10b981' }}>
                  ⚠️ <strong>Action Required:</strong> To finalize your order and arrange payment, you must send your order details to our team via WhatsApp.
                </div>
                <div className="flex gap-4 flex-wrap justify-center" style={{width:'100%', marginTop: '1rem'}}>
                  <a href={`https://wa.me/61400000000?text=Hi! I have placed an order on NVape Australia.%0A%0ARef: ${orderRef}%0ATotal: $${total.toFixed(2)} AUD%0APayment Method: ${method}%0A%0APlease provide payment details.`} target="_blank" rel="noreferrer" className="btn btn-primary" style={{ background: '#25D366', borderColor: '#25D366', color: '#fff', fontWeight: 800 }}>
                    💬 Complete Order on WhatsApp
                  </a>
                  <button className="btn btn-outline" onClick={() => navigate('/')}>Continue Shopping</button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {step < 3 && <Summary />}
        </div>
      </div>
    </div>
  );
}
