from flask import Blueprint, jsonify
# from flask_login import login_required
from app.models import User, db
from flask_login import login_required, current_user

user_routes = Blueprint('users', __name__)


@user_routes.route('/', methods=["GET"])

def users():
    users = User.query.all()
    return {'users': [user.to_dict() for user in users]}


@user_routes.route('/<int:id>', methods=["GET"])
def user(id):
    user = User.query.get(id)
    return user.to_dict()
