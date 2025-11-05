import { useEffect, useState } from 'react';

function Dashboard({ user, logout }) {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        
        console.log('User logged in:', user);
    }, [user]);

    return (
        <div className="dashboard">
            <header className="dashboard-header">
                <h1>Welcome, {user?.name}!</h1>
                <button onClick={logout} className="logout-btn">
                    Logout
                </button>
            </header>
            
            <div className="dashboard-content">
                <div className="user-info">
                    <h2>Your Information</h2>
                    <p><strong>Name:</strong> {user?.name}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Role:</strong> {user?.role}</p>
                </div>
                
                <div className="events-section">
                    <h2>Events</h2>
                    <p>Events will be displayed here...</p>
                    <ul className="event-list">
                        {events.map(event => (
                            <li key={event.id}>
                                <h3>{event.title}</h3>
                                <p><strong>Date:</strong> {event.date}</p>
                                <p><strong>Venue:</strong> {event.venue}</p>
                                <p>{event.description}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;