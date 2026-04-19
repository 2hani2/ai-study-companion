import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

export default function CourseView() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [tab, setTab] = useState('notes');
  const [flipped, setFlipped] = useState({});
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const getScore = () => {
    if (!course) return 0;
    return course.quiz.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;
  if (!course) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Course not found</div>;

  return (
    <div>
      <nav className="nav">
        <h2>🧠 StudyGenie</h2>
        <Link to="/dashboard">
          <button className="btn btn-primary">← Dashboard</button>
        </Link>
      </nav>
      <div className="container" style={{ marginTop: '30px' }}>
        <h2 style={{ color: '#6c63ff', marginBottom: '6px' }}>{course.title}</h2>
        {course.description && <p style={{ color: '#888', marginBottom: '20px' }}>{course.description}</p>}

        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          {['notes', 'flashcards', 'quiz'].map(t => (
            <button key={t} className="btn"
              style={{ background: tab === t ? '#6c63ff' : '#1a1a2e', color: tab === t ? 'white' : '#888', border: '1px solid #2a2a4a' }}
              onClick={() => { setTab(t); setSubmitted(false); setAnswers({}); }}>
              {t === 'notes' ? '📝 Notes' : t === 'flashcards' ? '🃏 Flashcards' : '📊 Quiz'}
            </button>
          ))}
        </div>

        {tab === 'notes' && (
          <div className="card">
            <pre style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '14px', color: '#ccc' }}>
              {course.content}
            </pre>
          </div>
        )}

        {tab === 'flashcards' && (
          <div>
            {course.flashcards.map((fc, i) => (
              <div key={i} className="card" style={{ cursor: 'pointer', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                onClick={() => setFlipped({ ...flipped, [i]: !flipped[i] })}>
                {flipped[i] ? (
                  <div>
                    <p style={{ fontSize: '11px', color: '#6c63ff', marginBottom: '8px' }}>ANSWER</p>
                    <p style={{ color: '#a0f0a0' }}>{fc.answer}</p>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontSize: '11px', color: '#888', marginBottom: '8px' }}>QUESTION — click to flip</p>
                    <p>{fc.question}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {tab === 'quiz' && (
          <div>
            {course.quiz.map((q, i) => (
              <div key={i} className="card">
                <p style={{ marginBottom: '12px', fontWeight: '600' }}>{i + 1}. {q.question}</p>
                {q.options.map((opt, j) => (
                  <div key={j} onClick={() => !submitted && setAnswers({ ...answers, [i]: j })}
                    style={{
                      padding: '10px 14px', borderRadius: '8px', marginBottom: '8px', cursor: submitted ? 'default' : 'pointer',
                      background: submitted
                        ? j === q.correct ? '#1a3a1a' : answers[i] === j ? '#3a1a1a' : '#12122a'
                        : answers[i] === j ? '#2a2a5a' : '#12122a',
                      border: `1px solid ${submitted ? j === q.correct ? '#4caf50' : answers[i] === j ? '#e74c3c' : '#2a2a4a' : answers[i] === j ? '#6c63ff' : '#2a2a4a'}`,
                      fontSize: '14px'
                    }}>
                    {opt}
                    {submitted && j === q.correct && <span style={{ color: '#4caf50', marginLeft: '8px' }}>✓</span>}
                    {submitted && answers[i] === j && j !== q.correct && <span style={{ color: '#e74c3c', marginLeft: '8px' }}>✗</span>}
                  </div>
                ))}
              </div>
            ))}
            {!submitted ? (
              <button className="btn btn-primary" style={{ width: '100%', padding: '12px' }}
                onClick={() => setSubmitted(true)}>Submit Quiz</button>
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '30px' }}>
                <h3 style={{ color: '#6c63ff', marginBottom: '8px' }}>
                  Score: {getScore()} / {course.quiz.length}
                </h3>
                <p style={{ color: '#888' }}>
                  {getScore() === course.quiz.length ? '🎉 Perfect score!' : getScore() >= course.quiz.length / 2 ? '👍 Good job!' : '📚 Keep studying!'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
