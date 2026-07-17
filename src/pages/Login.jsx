import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const calculateStrength = (pwd) => {
    let score = 0;
    if (pwd.length > 5) score += 1;
    if (pwd.length > 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    
    if (pwd.length === 0) return { label: '', color: '#ddd', width: '0%' };
    if (score < 2) return { label: 'Weak', color: '#ff4d4f', width: '33%' };
    if (score < 4) return { label: 'Fair', color: '#faad14', width: '66%' };
    return { label: 'Strong', color: '#52c41a', width: '100%' };
  };

  const strength = calculateStrength(form.password);

  const F = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Check lockout
    if (mode === 'login' && lockoutUntil && Date.now() < lockoutUntil) {
      const waitMins = Math.ceil((lockoutUntil - Date.now()) / 60000);
      setError(`Too many failed attempts. Please try again in ${waitMins} minute(s).`);
      return;
    }

    if (mode === 'register' && form.password !== form.confirm) {
      setError('Passwords do not match.'); return;
    }
    if (mode === 'register' && form.password.length < 6) {
      setError('Password must be at least 6 characters.'); return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // simulate network
    
    const result = mode === 'login'
      ? login(form.email, form.password)
      : register(form.name, form.email, form.password);
      
    setLoading(false);
    
    if (result.error) { 
      setError(result.error); 
      if (mode === 'login') {
        const newAttempts = failedAttempts + 1;
        setFailedAttempts(newAttempts);
        if (newAttempts >= 3) {
          setLockoutUntil(Date.now() + 5 * 60000); // 5 minutes lockout
          setError('Too many failed attempts. Account locked for 5 minutes.');
        }
      }
      return; 
    }
    
    // Success, reset limits
    setFailedAttempts(0);
    setLockoutUntil(null);
    navigate('/account');
  };

  return (
    <div className="login-page min-h-screen">
      <div className="login-card animate-slide-up">

        {/* Logo */}
        <div className="login-header">
          <Link to="/" className="logo-link" style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="logo-text" style={{ fontSize: '1.6rem' }}>N<span>VAPE</span></div>
            <div className="logo-sub" style={{ fontSize: '.6rem' }}>AUSTRALIA</div>
          </Link>
          <h1 className="login-title">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="login-subtitle text-muted">
            {mode === 'login' ? 'Sign in to your NVape Australia account' : 'Join thousands of happy customers'}
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(210,19,19,.1)', border: '1px solid rgba(210,19,19,.3)', borderRadius: '8px', padding: '.75rem 1rem', color: 'var(--accent)', fontSize: '.875rem', marginBottom: '1rem' }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
              <input className="input input-indented" type={showPwd ? 'text' : 'password'} placeholder="••••••••" required value={form.password} onChange={F('password')} style={{ paddingRight: '40px' }} />
              <button type="button" onClick={() => setShowPwd(p => !p)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#777' }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            {mode === 'register' && form.password.length > 0 && (
              <div style={{ marginTop: '.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', marginBottom: '.25rem' }}>
                  <span style={{ color: '#666' }}>Password strength:</span>
                  <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: '#eee', borderRadius: '2px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: strength.width, background: strength.color, transition: 'all 0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {mode === 'register' && (
            <div>
              <label className="form-label">Confirm Password</label>
              <div className="input-with-icon">
                <Lock size={16} className="input-icon" />
                <input className="input input-indented" type="password" placeholder="••••••••" required value={form.confirm} onChange={F('confirm')} />
              </div>
            </div>
          )}

          {mode === 'login' && (
            <div style={{ textAlign: 'right', marginTop: '-.5rem' }}>
              <span className="text-sm text-accent" style={{ cursor: 'pointer' }}>Forgot password?</span>
            </div>
          )}

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? 'Please wait…' : (
              <>{mode === 'login' ? 'Sign In' : 'Create Account'} <ArrowRight size={16} /></>
            )}
          </button>
        </form>

        {mode === 'login' && (
          <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#f7f7f7', borderRadius: '8px', fontSize: '.85rem', color: '#666' }}>
            <p>📦 <strong>Have an order?</strong> <Link to="/track" style={{ color: 'var(--accent)', fontWeight: 600 }}>Track your order here</Link> — no account needed.</p>
          </div>
        )}

        <div className="login-footer">
          {mode === 'login' ? (
            <p className="text-sm text-muted text-center">
              Don't have an account?{' '}
              <button className="text-accent" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => { setMode('register'); setError(''); }}>
                Create one free
              </button>
            </p>
          ) : (
            <p className="text-sm text-muted text-center">
              Already have an account?{' '}
              <button className="text-accent" style={{ background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700 }} onClick={() => { setMode('login'); setError(''); }}>
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
