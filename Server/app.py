from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from models import db
from config import Config
from routes.auth_routes import auth_bp
from routes.event_routes import event_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
CORS(app)
jwt = JWTManager(app)

app.register_blueprint(auth_bp)
app.register_blueprint(event_bp)

with app.register_blueprint(auth_bp):
    db.create_all()

if __name__ == '__main__':
    app.run(debug=True)