# app/api/settings_routes.py
from flask import Blueprint, jsonify, request
from app.models import db, Setting
from flask_login import login_required, current_user

settings_routes = Blueprint('settings', __name__)

# Get current round limit
@settings_routes.route('/round-limit', methods=['GET'])
def get_round_limit():
    setting = Setting.query.first()
    if not setting:
        round_limit_value = 8  # Default value if not set in the database
    else:
        round_limit_value = setting.season_round_limit
    return jsonify({"round_limit": round_limit_value})

# Admin route to update the round limit
@settings_routes.route('/round-limit', methods=['POST'])
@login_required
def update_round_limit():
    if not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

    new_limit = request.json.get('round_limit')
    if not new_limit:
        return jsonify({"error": "No round limit provided"}), 400

    setting = Setting.query.first()
    if not setting:
        setting = Setting(season_round_limit=new_limit)
        db.session.add(setting)
    else:
        setting.season_round_limit = new_limit
    
    db.session.commit()

    return jsonify({"message": "Round limit updated", "round_limit": new_limit})
