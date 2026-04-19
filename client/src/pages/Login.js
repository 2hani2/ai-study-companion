import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/auth/login', form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 style={{ color: '#6c63ff', marginBottom: '20px', textAlign: 'center' }}>🧠 StudyGenie</h2>
        <h3 style={{ marginBottom: '16px' }}>Login</h3>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input className="input" type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input className="input" type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button className="btn btn-primary" type="submit" style={{ width: '100%', marginTop: '12px' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={{ marginTop: '16px', textAlign: 'center', fontSize: '14px' }}>
          No account? <Link to="/register" style={{ color: '#6c63ff' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
