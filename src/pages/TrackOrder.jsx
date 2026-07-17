import { useState } from 'react';
import { Search, Package, MapPin, Truck, CheckCircle, Clock } from 'lucide-react';
import './TrackOrder.css';

const FAKE_ORDERS = {
  'NVP-123456': { status:'delivered', product:'ELFBAR BC5000 Ultra x2', total:'$49.98', date:'2024-01-10', steps:[
    { label:'Order Placed', desc:'Your order has been confirmed.', done:true, date:'10 Jan 9:02am' },
    { label:'Payment Received', desc:'Payment verified and processed.', done:true, date:'10 Jan 9:45am' },
    { label:'Packed & Dispatched', desc:'Your order has been packed and dispatched.', done:true, date:'10 Jan 2:30pm' },
    { label:'In Transit', desc:'Your order is on its way.', done:true, date:'11 Jan 8:00am' },
    { label:'Delivered', desc:'Your order has been delivered.', done:true, date:'12 Jan 11:20am' },
  ]},
  'NVP-654321': { status:'in_transit', product:'Hayati Pro Ultra 15000 x1', total:'$34.99', date:'2024-01-15', steps:[
    { label:'Order Placed', desc:'Your order has been confirmed.', done:true, date:'15 Jan 10:00am' },
    { label:'Payment Received', desc:'Payment verified and processed.', done:true, date:'15 Jan 11:00am' },
    { label:'Packed & Dispatched', desc:'Your order has been packed and dispatched.', done:true, date:'15 Jan 3:00pm' },
    { label:'In Transit', desc:'Your order is on its way.', done:true, date:'16 Jan 8:00am' },
    { label:'Delivered', desc:'Estimated delivery: 17 Jan', done:false, date:'Expected 17 Jan' },
  ]},
};

export default function TrackOrder() {
  const [ref, setRef] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const track = (e) => {
    e.preventDefault();
    if (!ref.trim()) return;
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      const found = FAKE_ORDERS[ref.trim().toUpperCase()];
      if (found) setResult(found);
      else setError('Order not found. Please check your reference number and try again.');
    }, 1200);
  };

  const StatusIcon = { delivered: <CheckCircle size={20}/>, in_transit: <Truck size={20}/>, processing: <Clock size={20}/> };

  return (
    <div className="track-order-page container">
      <div style={{textAlign:'center', marginBottom:'2.5rem'}}>
        <h1 style={{fontSize:'2rem', fontWeight:700, marginBottom:'.5rem'}}>Track Your Order</h1>
        <p className="text-muted">Enter your order reference number below to track your order.</p>
      </div>

      <div className="track-card-form">
        <form onSubmit={track} className="flex gap-4 items-center flex-wrap">
          <Package size={20} className="text-accent" style={{color:'var(--accent)', flexShrink:0}} />
          <input
            className="input"
            style={{flex:1, minWidth:'200px'}}
            placeholder="e.g. NVP-123456"
            value={ref}
            onChange={e => setRef(e.target.value)}
          />
          <button className="btn btn-primary" type="submit" disabled={loading} style={{whiteSpace:'nowrap'}}>
            {loading ? 'Searching…' : <><Search size={16}/> Track Order</>}
          </button>
        </form>
        <p className="text-sm text-muted" style={{marginTop:'.75rem'}}>💡 Try: NVP-123456 or NVP-654321 for a demo</p>
      </div>

      {error && <div className="track-error">{error}</div>}

      {result && (
        <div className="tracking-results animate-fade-in">
          <div className="track-summary">
            <div>
              <p className="text-sm text-muted">Order Reference</p>
              <p className="font-bold">{ref.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Product</p>
              <p className="font-bold">{result.product}</p>
            </div>
            <div>
              <p className="text-sm text-muted">Total</p>
              <p className="font-bold text-accent">{result.total}</p>
            </div>
            <div className={`track-status-badge status-${result.status}`}>
              {StatusIcon[result.status]} {result.status.replace('_',' ')}
            </div>
          </div>

          <div className="timeline-flow">
            {result.steps.map((step, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-icon-col">
                  <div className={`icon-circle${step.done?' done':' pending'}`}>
                    {step.done ? <CheckCircle size={14}/> : <Clock size={14}/>}
                  </div>
                  {i < result.steps.length - 1 && <div className={`timeline-connector${step.done?' done':''}`} />}
                </div>
                <div className="timeline-text-col">
                  <p className={`step-title font-bold${!step.done?' text-muted':''}`}>{step.label}</p>
                  <p className="step-desc text-sm text-muted">{step.desc}</p>
                  <p className="text-sm" style={{color:'var(--accent)', marginTop:'.25rem'}}>{step.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
