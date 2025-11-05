import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

function EventsPage({ user }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    setError('Failed to load events');
                }
            } catch (err) {
            
                setError(err.message || 'Failed to load events');
            } finally {
                setLoading(false);
            }
        };

        getEvents();
    }, []);

    if (loading) {
        return <div className="loading">Loading events...</div>;
    }

    return (
        <div className="events-page">
            <h1>Upcoming Training Events</h1>
            
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {!user && (
                <p className="login-prompt">
                    Please <a href="/login">login</a> to register for events
                </p>
            )}

            <div className="events-grid">
                {events.length > 0 ? (
                    events.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            user={user}
                        />
                    ))
                ) : (
                    <p>No events available</p>
                )}
            </div>
        </div>
    );
}

export default EventsPage;