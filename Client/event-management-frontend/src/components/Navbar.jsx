import React from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar({ user, logout }) {
const location = useLocation();

const handleLogout = () => {
logout();
};

 return (
   <nav className="navbar">
   <div className="nav-container">
     <Link to="/" className="nav-logo">
        Training Events
     </Link>

     <div className="nav-links">
     {user ? (
       <>
       <Link
       to="/events"
       className={location.pathname === '/events' ? 'nav-link active' : 'nav-link'}
       >
       Events
       </Link>
     {user.role === 'employee' && (
       <Link
         to="/feedback"
         className={location.pathname === '/feedback' ? 'nav-link active' : 'nav-link'}
       >
         Feedback
       </Link>
       )}

      {user.role === 'admin' && (
       <Link
         to="/admin"
       className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
       >
        Admin
       </Link>
         )}

     <span className="user-info">Hello, {user.name}</span>
     <button onClick={handleLogout} className="logout-btn">
       Logout
      </button>
    </>
     ) : (
     <>
     <Link to="/login" className="nav-link">Login</Link>
    <Link to="/register" className="nav-link">Register</Link>
   </>
   )}
   </div>
      </div>
   </nav>
  );
 }

export default Navbar;