import { useState } from 'react';

function EventCard({ event, user, onRegister }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        if (!user) {
            setMessage('Please login to register');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/events/${event.id}/register`, {
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
                setMessage('Successfully registered!');
                if (onRegister) {
                    onRegister(event.id);
                }
            } else {
                setMessage('Registration failed');
            }
        } catch (err) {
            setMessage('Error registering for event');
        }
        setLoading(false);
    };

    const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';

    return (
        <div className="event-card">
            <h3>{event.title}</h3>
            <div className="event-details">
                <p><strong>Date:</strong> {eventDate}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Description:</strong> {event.description}</p>
            </div>

            {user && user.role === 'employee' && (
                <div className="event-actions">
                    <button
                        onClick={handleRegister}
                        disabled={loading}
                        className="register-btn"
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            )}
        </div>
    );
}

export default EventCard;