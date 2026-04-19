import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api';

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const { data } = await api.get('/courses');
      setCourses(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this course?')) return;
    try {
      await api.delete(`/courses/${id}`);
      setCourses(courses.filter(c => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div>
      <nav className="nav">
        <h2>🧠 StudyGenie</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span className="badge">⚡ {user?.credits} credits</span>
          <span style={{ fontSize: '14px' }}>Hi, {user?.name}</span>
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      <div className="container" style={{ marginTop: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3>My Courses</h3>
          <Link to="/create">
            <button className="btn btn-primary">+ New Course</button>
          </Link>
        </div>
        {loading ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Loading...</p>
        ) : courses.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ color: '#888', marginBottom: '16px' }}>No courses yet. Create your first one!</p>
            <Link to="/create">
              <button className="btn btn-primary">+ Create Course</button>
            </Link>
          </div>
        ) : (
          courses.map(course => (
            <div className="card" key={course._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#6c63ff', marginBottom: '6px' }}>{course.title}</h4>
                <p style={{ fontSize: '13px', color: '#888' }}>{course.description || 'No description'}</p>
                <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>
                  {course.flashcards?.length || 0} flashcards · {course.quiz?.length || 0} quiz questions
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/course/${course._id}`}>
                  <button className="btn btn-primary">View</button>
                </Link>
                <button className="btn btn-danger" onClick={() => handleDelete(course._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
