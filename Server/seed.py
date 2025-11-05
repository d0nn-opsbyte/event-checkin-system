from app import app, db
from models import User, Event
from datetime import datetime

with app.app_context():
    db.drop_all()
    db.create_all()

    admin = User(name="Admin User", email="admin@example.com", role="admin")
    admin.set_password("admin123")

    emp = User(name="John Doe", email="john@example.com", role="employee")
    emp.set_password("password")

    db.session.add_all([admin, emp])
    db.session.commit()

    # ✅ Use datetime objects, not strings
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

    db.session.add_all([event1, event2])
    db.session.commit()

    print("✅ Database seeded successfully!")
