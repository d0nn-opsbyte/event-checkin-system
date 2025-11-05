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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventsResponse, feedbacksResponse] = await Promise.all([
                    fetch('http://127.0.0.1:5000/events'),
                    fetch('http://127.0.0.1:5000/feedbacks')
                ]);

                if (eventsResponse.ok) {
                    const eventsData = await eventsResponse.json();
                    setEvents(eventsData);
                }

                if (feedbacksResponse.ok) {
                    const feedbacksData = await feedbacksResponse.json();
                    setFeedbacks(feedbacksData);
                }
            } catch (err) {
                console.log('Error loading data');
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://127.0.0.1:5000/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newEvent)
            });

            if (response.ok) {
                const createdEvent = await response.json();
                setEvents([...events, createdEvent]);
                setNewEvent({ title: '', date: '', venue: '', description: '' });
                setShowEventForm(false);
            }
        } catch (err) {
            console.log('Error creating event');
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (!window.confirm('Are you sure you want to delete this event?')) return;

        try {
            const response = await fetch(`http://127.0.0.1:5000/events/${eventId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setEvents(events.filter(event => event.id !== eventId));
            }
        } catch (err) {
            console.log('Error deleting event');
        }
    };

    if (loading) {
        return <div className="loading">Loading admin panel...</div>;
    }

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <div className="admin-sections">
                <section className="admin-section">
                    <div className="section-header">
                        <h2>Manage Events</h2>
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
                                />
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea
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
                                    <p><strong>Date:</strong> {event.date}</p>
                                    <p><strong>Venue:</strong> {event.venue}</p>
                                    <p>{event.description}</p>
                                </div>
                                <button
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

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
                                    <p><strong>Event:</strong> {feedback.eventTitle}</p>
                                    <p><strong>Comment:</strong> {feedback.comment}</p>
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