import { useState, useEffect } from 'react';

function FeedbackPage() {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    const sampleEvents = [
        { id: 1, title: 'React Fundamentals Workshop' },
        { id: 2, title: 'Team Leadership Training' },
        { id: 3, title: 'Project Management Basics' },
    ];

    useEffect(() => {
        // Simulate loading events
        const t = setTimeout(() => setEvents(sampleEvents), 500);
        return () => clearTimeout(t);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedEvent) {
            setMessage('Please select an event');
            return;
        }

        setSubmitting(true);
        setMessage('');

        try {
            // Simulate API call
            setTimeout(() => {
                setMessage('Thank you for your feedback!');
                setSelectedEvent('');
                setRating(5);
                setComment('');
                setSubmitting(false);
            }, 1000);
        } catch (error) {
            setMessage('Error submitting feedback');
            setSubmitting(false);
        }
    };

    return (
        <div className="feedback-page">
            <h1>Submit Feedback</h1>

            {message && (
                <div className={message.includes('Error') ? 'error-message' : 'success-message'}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label htmlFor="event-select">Select Event:</label>
                    <select
                        id="event-select"
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
                </div>

                <div className="form-group">
                    <label htmlFor="rating">Rating: {rating} ⭐</label>
                    <input
                        id="rating"
                        type="range"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(parseInt(e.target.value, 10))}
                        className="rating-slider"
                    />
                    <div className="rating-labels">
                        <span>1 (Poor)</span>
                        <span>5 (Excellent)</span>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comments">Comments:</label>
                    <textarea
                        id="comments"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about the event..."
                        rows="4"
                    />
                </div>

                <button type="submit" disabled={submitting} className="submit-btn">
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}

export default FeedbackPage;