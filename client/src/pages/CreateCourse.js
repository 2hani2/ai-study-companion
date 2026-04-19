import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function CreateCourse() {
  const [form, setForm] = useState({ title: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await api.post('/courses', form);
      navigate(`/course/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
    setLoading(false);
  };

  return (
    <div>
      <nav className="nav">
        <h2>🧠 StudyGenie</h2>
        <Link to="/dashboard">
          <button className="btn btn-primary">← Back</button>
        </Link>
      </nav>
      <div className="container" style={{ marginTop: '40px', maxWidth: '600px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '20px' }}>✨ Create New Course</h3>
          <p style={{ color: '#888', fontSize: '13px', marginBottom: '20px' }}>
            AI will generate study notes, flashcards, and a quiz for you. Costs 1 credit.
          </p>
          {error && <p className="error">{error}</p>}
          <form onSubmit={handleSubmit}>
            <label style={{ fontSize: '13px', color: '#888' }}>Course Title *</label>
            <input className="input" type="text" placeholder="e.g. Introduction to Machine Learning"
              value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <label style={{ fontSize: '13px', color: '#888', marginTop: '10px', display: 'block' }}>Description (optional)</label>
            <textarea className="input" placeholder="What should the AI focus on?"
              value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
              rows={4} style={{ resize: 'vertical' }} />
            <button className="btn btn-primary" type="submit"
              style={{ width: '100%', marginTop: '16px', padding: '12px' }} disabled={loading}>
              {loading ? '⏳ Generating with AI... (may take 10-15 seconds)' : '🚀 Generate Course'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
