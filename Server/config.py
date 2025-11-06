import os

BASE_DIR = os.path.abspath(os.path.dirname(__file__))

class Config:
 
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', f"sqlite:///{os.path.join(BASE_DIR, 'instance', 'app.db')}").replace("postgres://", "postgresql://", 1)
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY', "supersecretkey")
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', "jwt-secret")
    
   
    GUNICORN_BIND = "0.0.0.0:10000"
    GUNICORN_WORKERS = 2
    GUNICORN_TIMEOUT = 120
    GUNICORN_ACCESSLOG = "-"
    GUNICORN_ERRORLOG = "-"


gunicorn_config = {
    'bind': '0.0.0.0:10000',
    'workers': 2,
    'timeout': 120,
    'accesslog': '-',
    'errorlog': '-'
}