from app import app, db
from models import User, Event, Feedback

with app.app_context():
    db.create_all()

    admin = User(name="Admin", email="admin@example.com")
    admin.set_password("123456")

    employee1 = User(name="Employee One", email="employee1@example.com")
    employee1.set_password("123456")

    employee2 = User(name="Employee Two", email="employee2@example.com")
    employee2.set_password("123456")

    event1 = Event(title="Annual Meeting", date="2024-12-01 10:00:00", venue="Conference Hall A", description="Company-wide annual meeting.")
    event2 = Event(title="Tech Workshop", date="2024-11-15 14:00:00", venue="Lab 3", description="Workshop on latest tech trends.")

    feedback1 = Feedback(rating=5, comments="Great event!", user_id=employee1.id, event_id=event1.id)
    feedback2 = Feedback(rating=4, comments="Very informative.", user_id=employee2.id, event_id=event2.id)

    db.session.add_all([admin, employee1, employee2, event1, event2, feedback1, feedback2])
    db.session.commit()

    print("Database seeded successfully.")