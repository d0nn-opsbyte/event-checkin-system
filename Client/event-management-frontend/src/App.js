import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import FeedbackPage from './pages/FeedbackPage';
import AdminPage from './pages/AdminPage';
import './App.css';

function App(){
  const [ user, setUser] = useState(null);
  const [ loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if ( token && userData ){
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <div className="app">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route
            path="/login"
            element={!user ? <LoginPage login={login} /> : <Navigate to="/events" />}
          />
          <Route
            path="/register"
            element={!user ? <RegisterPage login={login} /> : <Navigate to="/events" />}
          />
          <Route
            path="/events"
            element={<EventsPage user={user} />}
          />
          <Route
            path="/feedback"
            element={user ? <FeedbackPage user={user} /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={user && user.role === 'admin' ? <AdminPage user={user} /> : <Navigate to="/events" />}
          />
          <Route path="/" element={<Navigate to="/events" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
