import { Truck, Package, Clock, Info } from 'lucide-react';
import './Shipping.css';

const RATES = [
  { qty:'1–2 items', weight:'Up to 500g', standard:'$9.99', express:'$14.99', free:false },
  { qty:'3–5 items', weight:'500g–1kg', standard:'$12.99', express:'$17.99', free:false },
  { qty:'6–10 items', weight:'1kg–2kg', standard:'Free', express:'$9.99', free:true },
  { qty:'11+ items', weight:'2kg+', standard:'Free', express:'Free', free:true },
];

export default function Shipping() {
  return (
    <div className="container" style={{paddingTop:'3rem', paddingBottom:'5rem'}}>
      <div style={{textAlign:'center', marginBottom:'3rem'}}>
        <h1 style={{fontSize:'2rem', fontWeight:700, marginBottom:'.75rem'}}>Shipping Information</h1>
        <p className="text-muted">Fast, reliable delivery across Australia.</p>
      </div>

      {/* Highlights */}
      <div className="shipping-highlights">
        {[
          { icon:<Truck size={28}/>, title:'Free Standard Shipping', desc:'On all orders $50 and over, Australia-wide.' },
          { icon:<Package size={28}/>, title:'Same Day Dispatch', desc:'Orders placed before 2PM AEST dispatched same business day.' },
          { icon:<Clock size={28}/>, title:'Delivery Times', desc:'Standard: 2–5 business days. Express: 1–3 business days.' },
        ].map((h,i) => (
          <div key={i} className="ship-highlight">
            <div className="ship-icon">{h.icon}</div>
            <h3>{h.title}</h3>
            <p className="text-muted">{h.desc}</p>
          </div>
        ))}
      </div>

      {/* Rates Table */}
      <h2 style={{fontSize:'1.4rem', fontWeight:700, marginBottom:'1.5rem'}}>Shipping Rates</h2>
      <div className="shipping-table-wrapper">
        <table className="shipping-table">
          <thead>
            <tr>
              <th>Order Size</th>
              <th>Weight</th>
              <th>Standard Post</th>
              <th>Express Post</th>
            </tr>
          </thead>
          <tbody>
            {RATES.map((r, i) => (
              <tr key={i} className={r.free ? 'highlighted' : ''}>
                <td>{r.qty}</td>
                <td>{r.weight}</td>
                <td className={r.free ? 'free-ship' : ''}>{r.standard}</td>
                <td className={r.express === 'Free' ? 'free-ship' : ''}>{r.express}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notes */}
      <div className="ship-notes">
        <div className="ship-note-card">
          <div className="flex items-center gap-2 mb-2"><Info size={16} style={{color:'var(--accent)'}}/><strong>Important Notes</strong></div>
          <ul>
            <li>All orders are shipped via Australia Post with tracking.</li>
            <li>Delivery times are estimates and may vary during peak periods.</li>
            <li>PO Box and Parcel Locker deliveries are supported.</li>
            <li>For remote areas, allow extra 1–2 business days.</li>
            <li>We do not ship internationally at this time.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
