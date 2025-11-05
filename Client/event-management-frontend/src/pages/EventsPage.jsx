import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

function EventsPage({ user }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:5000/api/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    setError('Failed to load events');
                }
            } catch (err) {
                setError('Cannot connect to server');
            }
            setLoading(false);
        };

        getEvents();
    }, []);

    const handleRegister = async (eventId) => {
        if (!user) {
            alert('Please login to register for events');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/events/${eventId}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({
                    userId: user.id
                })
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                setEvents(events.map(event => 
                    event.id === updatedEvent.id ? updatedEvent : event
                ));
                alert('Successfully registered for event!');
            } else {
                alert('Registration failed');
            }
        } catch (err) {
            alert('Error registering for event');
        }
    };

    if (loading) {
        return <div className="loading">Loading events...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="events-page">
            <h1>Upcoming Training Events</h1>
            
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
                            onRegister={handleRegister}
                        />
                    ))
                ) : (
                    <p>No events found</p>
                )}
            </div>
        </div>
    );
}

export default EventsPage;