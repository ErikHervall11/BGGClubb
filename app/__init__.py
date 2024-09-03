import os
from flask import Flask, render_template, request, session, redirect
from flask_cors import CORS
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect, generate_csrf
from flask_login import LoginManager
from .models import db, User, Player, Round, Score, BestScore, Admin, Setting  # Add all your models here
from .api.user_routes import user_routes
from .api.auth_routes import auth_routes
from .api.player_routes import player_routes
from .api.round_routes import round_routes
from .api.score_routes import score_routes
from .api.settings_routes import settings_routes
from flask import send_from_directory

from .seeds import seed_commands
from .config import Config

app = Flask(__name__, static_folder='../react-vite/dist', static_url_path='/')

CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}}, supports_credentials=True)

# app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, '..', 'public', 'uploads')

# Set the upload folder path correctly
app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, '..', 'static', 'uploads')
# Max file size: 16MB
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# Setup login manager
login = LoginManager(app)
login.login_view = 'auth.unauthorized'

@login.user_loader
def load_user(id):
    return User.query.get(int(id))

# Tell flask about our seed commands
app.cli.add_command(seed_commands)

app.config.from_object(Config)
app.register_blueprint(user_routes, url_prefix='/api/users')
app.register_blueprint(auth_routes, url_prefix='/api/auth')
app.register_blueprint(player_routes, url_prefix='/api/players')
app.register_blueprint(round_routes, url_prefix='/api/rounds')
app.register_blueprint(score_routes, url_prefix='/api/scores')
app.register_blueprint(settings_routes, url_prefix='/api/settings')
db.init_app(app)
migrate = Migrate(app, db)  # This line initializes Flask-Migrate

# Application Security
# CORS(app)


@app.route('/static/uploads/<path:filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.before_request
def https_redirect():
    if os.environ.get('FLASK_ENV') == 'production':
        if request.headers.get('X-Forwarded-Proto') == 'http':
            url = request.url.replace('http://', 'https://', 1)
            code = 301
            return redirect(url, code=code)

@app.after_request
def inject_csrf_token(response):
    response.set_cookie(
        'csrf_token',
        generate_csrf(),
        secure=True if os.environ.get('FLASK_ENV') == 'production' else False,
        samesite='Strict' if os.environ.get(
            'FLASK_ENV') == 'production' else None,
        httponly=True)
    return response

@app.route("/api/docs")
def api_help():
    """
    Returns all API routes and their doc strings
    """
    acceptable_methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    route_list = { rule.rule: [[ method for method in rule.methods if method in acceptable_methods ],
                    app.view_functions[rule.endpoint].__doc__ ]
                    for rule in app.url_map.iter_rules() if rule.endpoint != 'static' }
    return route_list

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def react_root(path):
    """
    This route will direct to the public directory in our
    react builds in the production environment for favicon
    or index.html requests
    """
    if path == 'favicon.ico':
        return app.send_from_directory('public', 'favicon.ico')
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')
