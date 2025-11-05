# Event Check-In and Feedback System

A full-stack web application for managing company training events, built with Flask backend and React frontend.

## Features

### User Features

Event Registration - Register for training events

Feedback System - Submit feedback for attended events

Event Browsing - View all upcoming events

User Dashboard - Manage event registrations

### Admin Features

Event Management - Create and delete events

Feedback Monitoring - View all user feedback

Admin Dashboard - Comprehensive management interface

User Management - Monitor employee participation

## Tech Stack 

### Backend

-**Framework**: Flask

-**Database**: SQLite (Development) / PostgreSQL (Production Ready)

-**ORM**: SQLAlchemy

-**Authentication**: Flask-JWT-Extended

-**Security**: Flask-Bcrypt (Password Hashing)

-**CORS**: Flask-CORS

### Frontend

-**Framework**: React

-**Routing**: React Router DOM

-**HTTP Client**: Fetch API

-**State Management**: React Hooks (useState, useEffect)

-**Styling**: CSS3

## Project Structure

```
event-check-in-system/
├── Server/                          # Backend (Flask)
│   ├── app.py                      # Main application & API routes
│   ├── models.py                   # SQLAlchemy database models
│   ├── routes.py                   # API endpoint definitions
│   ├── seed.py                     # Database seeding script
│   ├── requirements.txt            # Python dependencies
│   └── instance/                   # Instance-specific files
│       └── app.db                  # SQLite database
│
├── Client/                          # Frontend (React)
│   ├── src/
│   │   ├── components/             # Reusable components
│   │   │   ├── EventCard.jsx      # Event display component
│   │   │   └── Navbar.jsx         # Navigation component
│   │   ├── pages/                  # Page components
│   │   │   ├── LoginPage.jsx      # Login page
│   │   │   ├── RegisterPage.jsx   # Registration page
│   │   │   ├── EventsPage.jsx     # Events listing page
│   │   │   ├── FeedbackPage.jsx   # Feedback submission page
│   │   │   └── AdminPage.jsx      # Admin dashboard
│   │   ├── App.jsx                # Main app component
│   │   ├── App.css                # Global styles
│   │   └── index.js               # Entry point
│   ├── public/                     # Static assets
│   └── package.json               # Node dependencies
│
└── README.md                       # Project documentation
```

## Live Application

-**Development URLs:**

-**Frontend**:
-**Backend**:
-**Database**:

## Default Credentials

### Admin Account

-**Email**: admin@example.com

-**Password**: admin123

-**Role**: Admin (can create/delete events, view all feedback)

### Employee Account

-**Email**: john@example.com

-**Password**: password

-**Role**: Employee

-**Email**: jane@example.com

-**Password**: password

-**Role**: Employee

## API Routes

### Authentication routes

### Authentication Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/auth/register` | Register new user | Public |
| POST | `/login` | Login and get JWT token | Public |

### Event Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/events` | Get all events | Public |
| POST | `/events` | Create new event | Admin |
| DELETE | `/events/<id>` | Delete event | Admin |
| POST | `/events/<id>/register` | Register for event | Employee |

### Feedback Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/events/<id>/feedback` | Submit feedback for event | Employee |
| GET | `/feedback` | Get all feedback | Admin |

### Admin Demo Routes
| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/admin/events` | Create event | Public |
| DELETE | `/admin/events/<id>` | Delete event | Public |
| GET | `/admin/feedback-demo` | Get all feedback | Public |

## Database Schema

### User Model

id (Integer, Primary Key)
name (String)
email (String, Unique)
password_hash (String)
role (String) - 'admin' or 'employee'


### Event Model

id (Integer, Primary Key)
title (String)
date (String)
venue (String)
description (Text)


### Feedback Model

id (Integer, Primary Key)
user_id (Integer, Foreign Key)
event_id (Integer, Foreign Key)
rating (Integer) - 1 to 5
comments (Text)


### Registration Model

id (Integer, Primary Key)
user_id (Integer, Foreign Key)
event_id (Integer, Foreign Key)
registered_at (DateTime)


## 🎯 User Roles & Permissions

### Admin
- Create and delete events
- View all user feedback
- Access admin dashboard
- Monitor employee participation

### Employee
- View all events
- Register for events
- Submit feedback for attended events
- Track personal event history

## 📥 Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd Server

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install flask
pip install flask-sqlalchemy
pip install flask-jwt-extended
pip install flask-cors
pip install flask-bcrypt


# Initialize database
python seed.py

# Start Flask server
python app.py
# Server runs on http://127.0.0.1:5000

# Navigate to frontend directory
cd Client

# Navigate to event-management-frontend
cd event-management-frontend

# Install dependencies
npm install

# Start React development server
npm start
# App runs on http://localhost:3000

```

## Troubleshooting

### Common Errors

#### CORS Errors

Ensure Flask-CORS is properly configured

Check that both servers are running

## Developer 

-**Donald Kiarie**

## License 

This project demonstrates full-stack development with Flask and React for educational purposes