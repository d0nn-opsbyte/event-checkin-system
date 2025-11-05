from app import app, db
from models import User, Event, Feedback
from datetime import datetime

with app.app_context():
    db.drop_all()
    db.create_all()

    # Create users
    admin = User(name="Admin User", email="admin@example.com", role="admin")
    admin.set_password("admin123")

    emp1 = User(name="John Doe", email="john@example.com", role="employee")
    emp1.set_password("password")

    emp2 = User(name="Jane Smith", email="jane@example.com", role="employee")
    emp2.set_password("password")

    db.session.add_all([admin, emp1, emp2])
    db.session.commit()

    # Create events
    event1 = Event(
        title="Annual Meeting",
        date=datetime(2024, 12, 1, 10, 0, 0),
        venue="Conference Hall A",
        description="Company-wide annual meeting."
    )

    event2 = Event(
        title="Tech Workshop",
        date=datetime(2024, 11, 15, 14, 0, 0),
        venue="Lab 3",
        description="Workshop on latest tech trends."
    )

    event3 = Event(
        title="Team Building",
        date=datetime(2024, 11, 20, 9, 0, 0),
        venue="Outdoor Park",
        description="Fun team building activities."
    )

    db.session.add_all([event1, event2, event3])
    db.session.commit()

    # Create sample feedback - USE 'comments' NOT 'comment'
    feedback1 = Feedback(
        user_id=emp1.id,
        event_id=event1.id,
        rating=5,
        comments="Great meeting! Very informative."  # ← Changed to 'comments'
    )

    feedback2 = Feedback(
        user_id=emp2.id,
        event_id=event1.id,
        rating=4,
        comments="Well organized, but ran a bit long."  # ← Changed to 'comments'
    )

    feedback3 = Feedback(
        user_id=emp1.id,
        event_id=event2.id,
        rating=5,
        comments="Excellent workshop! Learned a lot about new technologies."  # ← Changed to 'comments'
    )

    feedback4 = Feedback(
        user_id=emp2.id,
        event_id=event3.id,
        rating=3,
        comments="Activities were fun but could use more variety."  # ← Changed to 'comments'
    )

    db.session.add_all([feedback1, feedback2, feedback3, feedback4])
    db.session.commit()

    print("✅ Database seeded successfully!")
    print("👤 Admin: admin@example.com / admin123")
    print("👥 Employees: john@example.com / password, jane@example.com / password")
    print("📊 Created: 3 users, 3 events, 4 feedback entries")