import { useState } from 'react';

function EventCard({ event, user }) {
    const [registered, setRegistered] = useState(false);

    const handleRegister = () => {
        if (!user) {
            alert('Please login to register for events');
            return;
        }
        setRegistered(true);
    };

    const handleCancel = () => {
        setRegistered(false);
    };

    const eventDate = event.date ? new Date(event.date).toLocaleDateString() : 'TBD';

    return (
        <div className="event-card">
            <h3>{event.title}</h3>
            <div className="event-details">
                <p><strong>Date:</strong> {eventDate}</p>
                <p><strong>Venue:</strong> {event.venue || 'TBA'}</p>
                <p><strong>Description:</strong> {event.description || 'No description available'}</p>
            </div>

            {user && user.role === 'employee' && (
                <div className="event-actions">
                    {!registered ? (
                        <button
                            onClick={handleRegister}
                            className="register-btn"
                        >
                            Register for Event
                        </button>
                    ) : (
                        <div className="registered-actions">
                            <span className="registered-text">Registered ✓</span>
                            <button
                                onClick={handleCancel}
                                className="cancel-btn"
                            >
                                Cancel Registration
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default EventCard;