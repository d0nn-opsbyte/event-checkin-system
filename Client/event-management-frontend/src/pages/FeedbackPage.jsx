import { useState, useEffect } from 'react';

function FeedbackPage({ user }) {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

    useEffect(() => {
        const getEvents = async () => {
            try {
                const response = await fetch(`${API_URL}/events`);
                if (response.ok) {
                    const data = await response.json();
                    setEvents(data);
                } else {
                    setMessage('Failed to load events');
                }
            } catch (err) {
                setMessage('Cannot connect to server');
            }
        };

        getEvents();
    }, [API_URL]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedEvent || !rating) {
            setMessage('Please select an event and provide a rating');
            return;
        }

        setLoading(true);
        setMessage('');

        try {
            const token = localStorage.getItem('token');
            
            // Enhanced debugging
            console.log('=== FEEDBACK SUBMISSION DEBUG ===');
            console.log('URL:', `${API_URL}/events/${selectedEvent}/feedback`);
            console.log('Event ID (type):', selectedEvent, typeof selectedEvent);
            console.log('Rating (type):', rating, typeof rating);
            console.log('Comment (type):', comment, typeof comment);
            
            // Ensure rating is a number (not string)
            const payload = {
                rating: Number(rating),  // ✅ Explicitly convert to number
                comment: comment || ''   // ✅ Ensure comment is always a string
            };
            
            console.log('Final payload:', payload);

            const response = await fetch(`${API_URL}/events/${selectedEvent}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            console.log('Response status:', response.status);
            
            // Handle cases where response might not be JSON
            let result;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                result = await response.json();
            } else {
                const text = await response.text();
                result = { message: text || 'Non-JSON response' };
            }
            
            console.log('Full response:', result);

            if (response.ok) {
                setMessage('✅ Feedback submitted successfully!');
                setSelectedEvent('');
                setRating(0);
                setComment('');
            } else {
                // More detailed error messages
                if (response.status === 422) {
                    setMessage(`❌ Validation Error: ${result.message || 'Check rating (1-5) and data types'}`);
                } else if (response.status === 401) {
                    setMessage('❌ Authentication failed. Please log in again.');
                } else if (response.status === 403) {
                    setMessage('❌ Only employees can submit feedback.');
                } else if (response.status === 404) {
                    setMessage('❌ Event not found.');
                } else {
                    setMessage(`❌ Server error (${response.status}): ${result.message || result.error || 'Please try again'}`);
                }
            }
        } catch (err) {
            console.error('Network error:', err);
            setMessage('❌ Network error. Check console and ensure backend is running.');
        }
        setLoading(false);
    };

    return (
        <div className="feedback-page">
            <h1>Submit Event Feedback</h1>
            
            {message && (
                <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="feedback-form">
                <div className="form-group">
                    <label>Select Event:</label>
                    <select 
                        value={selectedEvent} 
                        onChange={(e) => setSelectedEvent(e.target.value)}
                        required
                    >
                        <option value="">Choose an event...</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {event.title} {event.date ? `(${event.date})` : ''}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Rating:</label>
                    <div className="rating-stars">
                        {[1, 2, 3, 4, 5].map(star => (
                            <button
                                key={star}
                                type="button"
                                className={`star ${star <= (hoverRating || rating) ? 'active' : ''}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                    <div className="rating-text">
                        {rating > 0 ? `${rating} out of 5 stars` : 'Click stars to rate'}
                    </div>
                </div>

                <div className="form-group">
                    <label>Comments (optional):</label>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about the event..."
                        rows="4"
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading || !rating || !selectedEvent}
                    className="submit-btn"
                >
                    {loading ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </form>
        </div>
    );
}

export default FeedbackPage;