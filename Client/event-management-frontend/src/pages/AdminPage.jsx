import { useState, useEffect } from 'react';

function AdminPage({ user }) {
    const [events, setEvents] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [showEventForm, setShowEventForm] = useState(false);
    const [newEvent, setNewEvent] = useState({
        title: '',
        date: '',
        venue: '',
        description: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

   useEffect(() => {
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            const [eventsResponse, feedbacksResponse] = await Promise.all([
                fetch('http://127.0.0.1:5000/events'),
                fetch('http://127.0.0.1:5000/feedback', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })
            ]);

            if (eventsResponse.ok) {
                const eventsData = await eventsResponse.json();
                setEvents(eventsData);
            }

            if (feedbacksResponse.ok) {
                const feedbacksData = await feedbacksResponse.json();
                setFeedbacks(feedbacksData);
            } else if (feedbacksResponse.status === 401) {
                // Token expired - use the demo route as fallback
                const demoResponse = await fetch('http://127.0.0.1:5000/admin/feedback-demo');
                if (demoResponse.ok) {
                    const demoData = await demoResponse.json();
                    setFeedbacks(demoData);
                } else {
                    setError('Please log in again to view feedback');
                }
            } else {
                setError('Failed to load feedback');
            }
        } catch (err) {
            console.log('Error loading data:', err);
            setError('Cannot connect to server');
        }
        setLoading(false);
    };

    fetchData();
}, []);

const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
        console.log('Creating event with:', newEvent);
        
        
        const response = await fetch('http://127.0.0.1:5000/admin/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newEvent)
        });

        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('Server response:', result);

        if (response.ok) {
            setEvents([...events, result.event]);
            setNewEvent({ title: '', date: '', venue: '', description: '' });
            setShowEventForm(false);
            alert('Event created successfully!');
        } else {
            alert('Failed to create event: ' + (result.error || 'Unknown error'));
        }
    } catch (err) {
        console.error('Error creating event:', err);
        alert('Error creating event: ' + err.message);
    }
};

const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      
        const response = await fetch(`http://127.0.0.1:5000/admin/events/${eventId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            setEvents(events.filter(event => event.id !== eventId));
            alert('Event deleted successfully!');
        } else {
            const errorData = await response.json();
            alert('Failed to delete event: ' + (errorData.error || 'Unknown error'));
        }
    } catch (err) {
        alert('Error deleting event: ' + err.message);
    }
};    

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            <p>Welcome, {user?.name}! Role: {user?.role}</p>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="admin-sections">
                <section className="admin-section">
                    <div className="section-header">
                        <h2>Manage Events ({events.length})</h2>
                        <button
                            onClick={() => setShowEventForm(!showEventForm)}
                            className="btn-primary"
                        >
                            {showEventForm ? 'Cancel' : 'Add New Event'}
                        </button>
                    </div>

                    {showEventForm && (
                        <form onSubmit={handleCreateEvent} className="event-form">
                            <div className="form-group">
                                <label>Event Title:</label>
                                <input
                                    type="text"
                                    value={newEvent.title}
                                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    required
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div className="form-group">
                                <label>Date:</label>
                                <input
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Venue:</label>
                                <input
                                    type="text"
                                    value={newEvent.venue}
                                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                    required
                                    placeholder="Enter venue"
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    required
                                    placeholder="Enter event description"
                                    rows="3"
                                />
                            </div>
                            <button type="submit" className="submit-btn">
                                Create Event
                            </button>
                        </form>
                    )}

                    <div className="events-list">
                        {events.length === 0 ? (
                            <p>No events created yet.</p>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="event-item">
                                    <div className="event-info">
                                        <h4>{event.title}</h4>
                                        <p><strong>Date:</strong> {event.date || 'Not set'}</p>
                                        <p><strong>Venue:</strong> {event.venue || 'Not set'}</p>
                                        <p><strong>Description:</strong> {event.description || 'No description'}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteEvent(event.id)}
                                        className="delete-btn"
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <section className="admin-section">
                    <h2>All Feedback ({feedbacks.length})</h2>
                    <div className="feedback-list">
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <div key={feedback.id} className="feedback-item">
                                    <div className="feedback-header">
                                        <strong>User #{feedback.user_id}</strong>
                                        <span className="rating">Rating: {feedback.rating} ⭐</span>
                                    </div>
                                    <p><strong>Event ID:</strong> {feedback.event_id}</p>
                                    <p><strong>Comment:</strong> {feedback.comment || "No comment provided"}</p>
                                </div>
                            ))
                        ) : (
                            <p>No feedback submitted yet.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AdminPage;