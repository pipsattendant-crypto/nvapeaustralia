import { useState } from 'react';
import { Mail, Lock, User } from 'lucide-react';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ email:'', password:'', name:'' });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => { e.preventDefault(); setSuccess(true); };
  const F = (k) => (e) => setForm(p => ({...p, [k]:e.target.value}));

  if (success) return (
    <div className="login-page min-h-screen">
      <div className="login-card" style={{textAlign:'center'}}>
        <div style={{fontSize:'3rem', marginBottom:'1rem'}}>✅</div>
        <h2 style={{fontSize:'1.5rem', fontWeight:700, marginBottom:'.5rem'}}>
          {mode === 'login' ? 'Welcome back!' : 'Account Created!'}
        </h2>
        <p className="text-muted" style={{marginBottom:'1.5rem'}}>
          {mode === 'login' ? 'You have been signed in successfully.' : 'Your account has been created. You can now log in.'}
        </p>
        <a href="/" className="btn btn-primary w-full" style={{justifyContent:'center'}}>Go to Shop</a>
      </div>
    </div>
  );

  return (
    <div className="login-page min-h-screen">
      <div className="login-card animate-slide-up">
        <div className="login-header">
          <div style={{fontSize:'2.5rem', marginBottom:'.5rem'}}>🔐</div>
          <h1 className="login-title">{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
          <p className="login-subtitle text-muted">
            {mode === 'login' ? 'Access your NVape Australia account' : 'Join NVape Australia today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:'1rem'}}>
          {mode === 'register' && (
            <div>
              <label className="form-label">Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="input-icon" />
                <input className="input input-indented" placeholder="John Smith" required value={form.name} onChange={F('name')} />
              </div>
            </div>
          )}
          <div>
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon" />
              <input className="input input-indented" type="email" placeholder="you@example.com" required value={form.email} onChange={F('email')} />
            </div>
          </div>
          <div>
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon" />
              <input className="input input-indented" type="password" placeholder="••••••••" required value={form.password} onChange={F('password')} />
            </div>
          </div>
          {mode === 'login' && (
            <div style={{textAlign:'right', marginTop:'-.5rem'}}>
              <a href="#" className="text-sm text-accent">Forgot password?</a>
            </div>
          )}
          <button type="submit" className="btn btn-primary login-btn">{mode === 'login' ? 'Sign In' : 'Create Account'}</button>
        </form>

        <div className="login-footer">
          {mode === 'login' ? (
            <p className="text-sm text-muted text-center">Don't have an account? <button className="text-accent" style={{background:'none',border:'none',cursor:'pointer',fontWeight:600}} onClick={() => setMode('register')}>Register</button></p>
          ) : (
            <p className="text-sm text-muted text-center">Already have an account? <button className="text-accent" style={{background:'none',border:'none',cursor:'pointer',fontWeight:600}} onClick={() => setMode('login')}>Sign In</button></p>
          )}
        </div>
      </div>
    </div>
  );
}
