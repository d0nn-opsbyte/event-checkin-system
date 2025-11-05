
from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import db, User, Event, Feedback
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

  
    @app.route('/auth/login', methods=['POST'])
    def login():
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
           
            d = e.date.strftime("%Y-%m-%d") if hasattr(e, "date") and getattr(e, "date") else None
            out.append({"id": e.id, "title": e.title, "date": d, "venue": e.venue, "description": e.description})
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

        ev = Event(title=data.get("title"), date=data.get("date"), venue=data.get("venue"), description=data.get("description"))
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

   
    @app.route('/events/<int:event_id>/feedback', methods=['POST'])
    @jwt_required()
    def submit_feedback(event_id):
        identity = get_jwt_identity()
        data = request.get_json() or {}
        rating = data.get("rating")
        if rating is None:
            return jsonify({"error":"Rating required"}), 400
        if not Event.query.get(event_id):
            return jsonify({"error":"Event not found"}), 404
        fb = Feedback(user_id=identity["id"], event_id=event_id, rating=int(rating), comment=data.get("comment",""))
        db.session.add(fb)
        db.session.commit()
        return jsonify({"message":"Feedback saved"}), 201

    
    @app.route('/feedback', methods=['GET'])
    @jwt_required()
    def get_feedback():
        identity = get_jwt_identity()
        if identity.get("role") != "admin":
            return jsonify({"error":"Admins only"}), 403
        rows = Feedback.query.all()
        return jsonify([{"id":r.id,"user_id":r.user_id,"event_id":r.event_id,"rating":r.rating,"comment":r.comment} for r in rows])
