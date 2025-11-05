import { useState, useEffect } from 'react';
import EventCard from '../components/EventCard';

const sampleEvents = [
    {
        id: 1,
        title: 'React Fundamentals Workshop',
        date: '2024-02-15',
        venue: 'Conference Room A',
        description: 'Learn the basics of React development',
    },
    {
        id: 2,
        title: 'Team Leadership Training',
        date: '2024-02-20',
        venue: 'Main Auditorium',
        description: 'Develop leadership skills for team management',
    },
    {
        id: 3,
        title: 'Project Management Basics',
        date: '2024-03-01',
        venue: 'Training Room B',
        description: 'Introduction to project management methodologies',
    },
];

export default function EventsPage({ user }) {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let mounted = true;

        const fetchEvents = async () => {
            try {
                setLoading(true);
                // simulate network latency
                setTimeout(() => {
                    if (!mounted) return;
                    setEvents(sampleEvents);
                    setLoading(false);
                }, 1000);
            } catch (err) {
                if (!mounted) return;
                setError('Failed to load events');
                setLoading(false);
            }
        };

        fetchEvents();
        return () => {
            mounted = false;
        };
    }, []);

    const handleEventRegister = (eventId) => {
        console.log(`Registered for event ${eventId}`);
    };

    if (loading) return <div className="loading">Loading events...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="events-page">
            <div className="page-header">
                <h1>Upcoming Training Events</h1>
                {!user && (
                    <p className="login-prompt">
                        Please <a href="/login">login</a> to register for events
                    </p>
                )}
            </div>

            <div className="events-grid">
                {events.length > 0 ? (
                    events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            user={user}
                            onRegister={handleEventRegister}
                        />
                    ))
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </div>
    );
}
