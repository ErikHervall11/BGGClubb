# app/api/score_routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Score

score_routes = Blueprint('scores', __name__)


@score_routes.route('/player/<int:player_id>', methods=['GET'])
def get_player_scores(player_id):
    scores = Score.query.filter_by(player_id=player_id).all()
    return jsonify([score.to_dict() for score in scores])

# Get all scores
@score_routes.route('/', methods=['GET'])
def get_scores():
    scores = Score.query.all()
    return jsonify([score.to_dict() for score in scores])

# Get a single score by ID
@score_routes.route('/<int:id>', methods=['GET'])
def get_score(id):
    score = Score.query.get(id)
    if not score:
        return jsonify({"error": "Score not found"}), 404
    return jsonify(score.to_dict())

# Create a new score
@score_routes.route('/', methods=['POST'])
def create_score():
    data = request.get_json()
    new_score = Score(
        round_id=data['round_id'],
        player_id=data['player_id'],
        hole_number=data['hole_number'],
        strokes=data['strokes']
    )
    db.session.add(new_score)
    db.session.commit()
    return jsonify(new_score.to_dict()), 201

# Update an existing score
@score_routes.route('/<int:id>', methods=['PUT'])
def update_score(id):
    data = request.get_json()
    score = Score.query.get(id)
    if not score:
        return jsonify({"error": "Score not found"}), 404
    score.round_id = data['round_id']
    score.player_id = data['player_id']
    score.hole_number = data['hole_number']
    score.strokes = data['strokes']
    db.session.commit()
    return jsonify(score.to_dict())

# Delete a score
@score_routes.route('/<int:id>', methods=['DELETE'])
def delete_score(id):
    score = Score.query.get(id)
    if not score:
        return jsonify({"error": "Score not found"}), 404
    db.session.delete(score)
    db.session.commit()
    return jsonify({"message": "Score deleted successfully"}), 200
