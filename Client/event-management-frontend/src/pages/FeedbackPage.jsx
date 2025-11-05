import { useState, useEffect } from 'react';

function FeedbackPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const getEvents = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:5000/api/events');
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    setMessage('Failed to load events');
                }
            } catch (err) {
                setMessage('Cannot connect to server');
            }
            setLoading(false);
        };

        getEvents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEvent) {
            setMessage('Please select an event');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/events/${selectedEvent}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    rating: rating,
                    comment: comment
                })
            });

            if (response.ok) {
                setMessage('Thank you for your feedback!');
                setSelectedEvent('');
                setRating(5);
                setComment('');
            } else {
                setMessage('Error submitting feedback');
            }
        } catch (err) {
            setMessage('Cannot connect to server');
        }

        setLoading(false);
    };

    return (
        <div className="feedback-page">
            <h1>Submit Feedback</h1>

            {message && (
                <div className={message.includes('Thank') ? 'success-message' : 'error-message'}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Event:</label>
                    {loading ? (
                        <div>Loading events...</div>
                    ) : (
                        <select
                            value={selectedEvent}
                            onChange={(e) => setSelectedEvent(e.target.value)}
                            required
                        >
                            <option value="">Choose an event...</option>
                            {events.map((event) => (
                                <option key={event.id} value={event.id}>
                                    {event.title}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-group">
                    <label>Rating: {rating} ⭐</label>
                    <input
                        type="range"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value))}
                    />
                    <div className="rating-labels">
                        <span>1 (Poor)</span>
                        <span>5 (Excellent)</span>
                    </div>
                </div>

                <div className="form-group">
                    <label>Comments:</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about the event..."
                        rows="4"
                    />
                </div>

                <button type="submit" disabled={loading} className="submit-btn">
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}

export default FeedbackPage;