from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from models import User, Event, Feedback

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///instance/app.db'
app.config['JWT_SECRET_KEY'] = 'secret_key'
db = SQLAlchemy(app)
jwt = JWTManager(app)

def init_routes(app):
    @app.route('/')
    def home():
        return jsonify(message="Welcome to the Event Check-in System API")
    
    @app.route('/register', methods=['POST'])
    def register():
        data = request.get_json()
        user = User(
            name=data['name'],
            email=data['email'],
           role=data.get('role', 'employee')
        )
        user.set_password(data['password'])
        db.session.add(user)
        db.session.commit()
        return jsonify(message="User registered successfully"), 201
    
    @app.route('/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        if user and user.check_password(data['password']):
            access_token = create_access_token(identity={'id': user.id, 'role': user.role})
            return jsonify(access_token=access_token), 200
        return jsonify(message="Invalid credentials"), 401
    
    @app.route('/events', methods=['GET'])
    def get_events():
        events = Event.query.all()
        events_list = [{
            'id': event.id,
            'title': event.title,
            'date': event.date.isoformat(),
            'venue': event.venue,
            'description': event.description
        } for event in events]
        return jsonify(events=events_list), 200
    
    @app.route('/events', methods=['POST'])
    @jwt_required()
    def create_event():
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify(message="Admin access required"), 403
        
        data = request.get_json()
        event = Event(
            title=data['title'],
            date=datetime.fromisoformat(data['date']),
            venue=data['venue'],
            description=data.get('description', '')
        )
        db.session.add(event)
        db.session.commit()
        return jsonify(message="Event created successfully"), 201
    
    @app.route('/events</int:event_id>', methods=['DELETE'])
    @jwt_required()
    def delete_event(event_id):
        current_user = get_jwt_identity()
        if current_user['role'] != 'admin':
            return jsonify(message="Admin access required"), 403
        
        event = Event.query.get(event_id)
        if not event:
            return jsonify(message="Event not found"), 404
        
        db.session.delete(event)
        db.session.commit()
        return jsonify(message="Event deleted successfully"), 200

    @app.route('/event/<int:event_id>/feedback', methods=['POST'])
    @jwt_required()
    def submit_feedback(event_id):
        current_user = get_jwt_identity()
        data = request.get_json()
        feedback = Feedback(
            user_id=current_user['id'],
            event_id=event_id,
            rating=data['rating'],
            comment=data.get('comment', '')
        )
        db.session.add(feedback)
        db.session.commit()
        return jsonify(message="Feedback submitted successfully"), 201
    
    @app.route('/feedback', methods=['GET'])
    @jwt_required()
    def get_feedback():
        user = get_jwt_identity()
        if user['role'] != 'admin':
            return jsonify(message="Admin access required"), 403
        
        feedbacks = Feedback.query.all()
        return jsonify([
            {"user_id": fb.user_id, "event_id": fb.event_id, "rating": fb.rating, "comment": fb.comment}
            for fb in feedbacks
        ]), 200