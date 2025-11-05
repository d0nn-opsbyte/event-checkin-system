from flask import request, jsonify  
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Event, Feedback, Registration
from datetime import datetime

def init_routes(app):
    @app.route('/')
    def home():
        return jsonify({"message": "Event Check-In API running!"})

   
    @app.route('/auth/register', methods=['POST'])
    def register():
        data = request.get_json() or {}
        if not data.get("email") or not data.get("password"):
            return jsonify({"error": "Email and password required"}), 400
        if User.query.filter_by(email=data["email"]).first():
            return jsonify({"error": "Email already registered"}), 400
        user = User(name=data.get("name",""), email=data["email"], role=data.get("role","employee"))
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "User registered"}), 201

  
    @app.route('/login', methods=['POST', 'OPTIONS'])
    def login():
        if request.method == 'OPTIONS':
            return '', 200
        
        data = request.get_json() or {}
        user = User.query.filter_by(email=data.get("email")).first()
        if not user or not user.check_password(data.get("password")):
            return jsonify({"error": "Invalid credentials"}), 401
        token = create_access_token(identity={"id": user.id, "role": user.role})
        return jsonify({"token": token, "role": user.role, "name": user.name})
   
    @app.route('/events', methods=['GET'])
    def list_events():
        events = Event.query.order_by(Event.id).all()
        out = []
        for e in events:
          
            out.append({
                "id": e.id, 
                "title": e.title, 
                "date": e.date, 
                "venue": e.venue, 
                "description": e.description
            })
        return jsonify(out)

 
    @app.route('/events', methods=['POST'])
    @jwt_required()
    def create_event():
        identity = get_jwt_identity()
        if identity.get("role") != "admin":
            return jsonify({"error": "Admins only"}), 403
        data = request.get_json() or {}
        if not data.get("title"):
            return jsonify({"error": "Title required"}), 400

        ev = Event(
            title=data.get("title"), 
            date=data.get("date"), 
            venue=data.get("venue"), 
            description=data.get("description")
        )
        db.session.add(ev)
        db.session.commit()
        return jsonify({"message":"Event created","id":ev.id}), 201

 
    @app.route('/events/<int:event_id>', methods=['DELETE'])
    @jwt_required()
    def delete_event(event_id):
        identity = get_jwt_identity()
        if identity.get("role") != "admin":
            return jsonify({"error":"Admins only"}), 403
        ev = Event.query.get(event_id)
        if not ev:
            return jsonify({"error":"Event not found"}), 404
        db.session.delete(ev)
        db.session.commit()
        return jsonify({"message":"Event deleted"}), 200

   
    @app.route('/events/<int:event_id>/feedback', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def submit_feedback(event_id):
        if request.method == 'OPTIONS':
            return '', 200
            
        identity = get_jwt_identity()
        data = request.get_json() or {}
        rating = data.get("rating")
        if rating is None:
            return jsonify({"error":"Rating required"}), 400
        if not Event.query.get(event_id):
            return jsonify({"error":"Event not found"}), 404
        
        
        fb = Feedback(
            user_id=identity["id"], 
            event_id=event_id, 
            rating=int(rating), 
            comments=data.get("comments","") 
        )
        db.session.add(fb)
        db.session.commit()
        return jsonify({"message":"Feedback saved"}), 201

    @app.route('/events/<int:event_id>/register', methods=['POST', 'OPTIONS'])
    @jwt_required()
    def register_for_event(event_id):
        if request.method == 'OPTIONS':
            return '', 200
        
        try:
            identity = get_jwt_identity()
            user_id = identity["id"]
            
            event = Event.query.get(event_id)
            if not event:
                return jsonify({"error": "Event not found"}), 404
            
            existing_reg = Registration.query.filter_by(
                user_id=user_id, 
                event_id=event_id
            ).first()
            
            if existing_reg:
                return jsonify({"error": "Already registered for this event"}), 400
            
            registration = Registration(user_id=user_id, event_id=event_id)
            db.session.add(registration)
            db.session.commit()
            
            return jsonify({
                "message": "Successfully registered for event",
                "registration": registration.to_dict()
            }), 201
            
        except Exception as e:
            print(f"Registration error: {str(e)}")
            return jsonify({"error": "Server error during registration"}), 500
        
    @app.route('/feedback', methods=['GET'])
    @jwt_required()
    def get_all_feedback():
        identity = get_jwt_identity()
        if identity.get("role") != "admin":
            return jsonify({"error": "Admins only"}), 403

        feedbacks = Feedback.query.all()
        result = []
        for fb in feedbacks:
            user = User.query.get(fb.user_id)
            user_name = user.name if user else "Unknown User"

            event = Event.query.get(fb.event_id)
            event_title = event.title if event else "Unknown Event"

            result.append({
                "id": fb.id,
                "user_id": fb.user_id,
                "user_name": user_name,
                "event_id": fb.event_id,
                "event_title": event_title,
                "rating": fb.rating,
                "comments": fb.comments,  
                "created_at": fb.created_at.isoformat() if hasattr(fb, 'created_at') else "Unknown"
            })

        return jsonify(result)

   
    @app.route('/admin/events', methods=['POST'])
    def create_event_demo():
        """Simple event creation for admin demo - no authentication required"""
        try:
            data = request.get_json() or {}
            print("Creating event with data:", data)
            
            if not data.get('title'):
                return jsonify({"error": "Title is required"}), 400
                
        
            event = Event(
                title=data.get('title'),
                date=data.get('date'),
                venue=data.get('venue', ''),
                description=data.get('description', '')
            )
            
            db.session.add(event)
            db.session.commit()
            
            return jsonify({
                "message": "Event created successfully",
                "event": {
                    "id": event.id,
                    "title": event.title,
                    "date": event.date,
                    "venue": event.venue,
                    "description": event.description
                }
            }), 201
            
        except Exception as e:
            print("Error creating event:", str(e))
            return jsonify({"error": str(e)}), 500

    @app.route('/admin/events/<int:event_id>', methods=['DELETE'])
    def delete_event_demo(event_id):
        """Simple event deletion for admin demo - no authentication required"""
        try:
            event = Event.query.get(event_id)
            if not event:
                return jsonify({"error": "Event not found"}), 404
            
            
            Feedback.query.filter_by(event_id=event_id).delete()
            Registration.query.filter_by(event_id=event_id).delete()
            
            db.session.delete(event)
            db.session.commit()
            
            return jsonify({"message": "Event deleted successfully"}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.route('/admin/feedback-demo', methods=['GET'])
    def get_feedback_demo():
        """Public route for demo feedback - no authentication required"""
        feedbacks = Feedback.query.all()
        result = []
        for fb in feedbacks:
            user = User.query.get(fb.user_id)
            event = Event.query.get(fb.event_id)
            
            result.append({
                "id": fb.id,
                "user_name": user.name if user else "Unknown User",
                "event_title": event.title if event else "Unknown Event", 
                "rating": fb.rating,
                "comments": fb.comments,
                "user_id": fb.user_id,
                "event_id": fb.event_id
            })
        
        return jsonify(result)

    