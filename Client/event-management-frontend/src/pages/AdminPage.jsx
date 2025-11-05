import { useState, useEffect } from 'react';

function AdminPage() {
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

    const sampleEvents = [
        {
            id: 1,
            title: 'React Fundamentals Workshop',
            date: '2024-02-15',
            venue: 'Conference Room A',
            description: 'Learn the basics of React development'
        }
    ];

    const sampleFeedbacks = [
        {
            id: 1,
            userName: 'John Doe',
            eventTitle: 'React Fundamentals Workshop',
            rating: 5,
            comment: 'Great workshop! Learned a lot.',
            date: '2024-02-15'
        }
    ];

    useEffect(() => {
        // Simulate loading data
        const t = setTimeout(() => {
            setEvents(sampleEvents);
            setFeedbacks(sampleFeedbacks);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(t);
    }, []);

    const handleCreateEvent = (e) => {
        e.preventDefault();
        const event = { id: Date.now(), ...newEvent };
        setEvents((prev) => [...prev, event]);
        setNewEvent({ title: '', date: '', venue: '', description: '' });
        setShowEventForm(false);
    };

    const handleDeleteEvent = (eventId) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
        }
    };

    if (loading) {
        return <div className="loading">Loading admin panel...</div>;
    }

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <div className="admin-sections">
                {/* Events Management */}
                <section className="admin-section">
                    <div className="section-header">
                        <h2>Manage Events</h2>
                        <button
                            type="button"
                            onClick={() => setShowEventForm((s) => !s)}
                            className="btn-primary"
                        >
                            {showEventForm ? 'Cancel' : 'Add New Event'}
                        </button>
                    </div>

                    {showEventForm && (
                        <form onSubmit={handleCreateEvent} className="event-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="event-title">Event Title:</label>
                                    <input
                                        id="event-title"
                                        type="text"
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="event-date">Date:</label>
                                    <input
                                        id="event-date"
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-venue">Venue:</label>
                                <input
                                    id="event-venue"
                                    type="text"
                                    value={newEvent.venue}
                                    onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="event-description">Description:</label>
                                <textarea
                                    id="event-description"
                                    value={newEvent.description}
                                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    required
                                />
                            </div>

                            <button type="submit" className="submit-btn">
                                Create Event
                            </button>
                        </form>
                    )}

                    <div className="events-list">
                        {events.map((event) => (
                            <div key={event.id} className="event-item">
                                <div className="event-info">
                                    <h4>{event.title}</h4>
                                    <p>
                                        <strong>Date:</strong> {event.date}
                                    </p>
                                    <p>
                                        <strong>Venue:</strong> {event.venue}
                                    </p>
                                    <p>{event.description}</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Feedback Management */}
                <section className="admin-section">
                    <h2>All Feedback</h2>

                    <div className="feedback-list">
                        {feedbacks.length > 0 ? (
                            feedbacks.map((feedback) => (
                                <div key={feedback.id} className="feedback-item">
                                    <div className="feedback-header">
                                        <strong>{feedback.userName}</strong>
                                        <span>Rating: {feedback.rating} ⭐</span>
                                    </div>
                                    <p>
                                        <strong>Event:</strong> {feedback.eventTitle}
                                    </p>
                                    <p>
                                        <strong>Comment:</strong> {feedback.comment}
                                    </p>
                                    <small>Submitted on: {feedback.date}</small>
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