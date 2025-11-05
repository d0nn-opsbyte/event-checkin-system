import { useState } from 'react';

function EventCard({ event, user, onRegister }) {
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState('');

    const handleRegister = async () => {
        if (!user) {
            setMessage('Please login to register for events');
            return;
        }

        setRegistering(true);
        setMessage('');

        try {
            // Replace this with a real API call when ready
            setTimeout(() => {
                setMessage('Successfully registered for this event!');
                setRegistering(false);
                if (onRegister) onRegister(event.id);
            }, 1000);
        } catch (error) {
            setMessage('Error registering for event');
            setRegistering(false);
        }
    };

    const eventDate = event?.date
        ? new Date(event.date).toLocaleDateString()
        : 'TBD';

    return (
        <div className="event-card">
            <h3>{event?.title}</h3>
            <div className="event-details">
                <p><strong>Date:</strong> {eventDate}</p>
                <p><strong>Venue:</strong> {event?.venue}</p>
                <p><strong>Description:</strong> {event?.description}</p>
            </div>

            {user?.role === 'employee' && (
                <div className="event-actions">
                    <button
                        onClick={handleRegister}
                        disabled={registering}
                        className="register-btn"
                    >
                        {registering ? 'Registering...' : 'Register'}
                    </button>
                    {message && <p className="message">{message}</p>}
                </div>
            )}
        </div>
    );
}

export default EventCard;
