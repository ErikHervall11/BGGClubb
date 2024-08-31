# app/api/round_routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Round


round_routes = Blueprint('rounds', __name__)

# Get all rounds
@round_routes.route('/', methods=['GET'])
def get_rounds():
    rounds = Round.query.all()
    return jsonify([round.to_dict() for round in rounds])

# Get a single round by ID
@round_routes.route('/<int:id>', methods=['GET'])
def get_round(id):
    round = Round.query.get(id)
    if not round:
        return jsonify({"error": "Round not found"}), 404
    return jsonify(round.to_dict())

# Create a new round
@round_routes.route('/', methods=['POST'])
def create_round():
    data = request.get_json()
    new_round = Round(
        scorer_id=data['scorer_id'],
        attester_id=data['attester_id'],
        scorecard_image=data.get('scorecard_image')
    )
    db.session.add(new_round)
    db.session.commit()
    return jsonify(new_round.to_dict()), 201

# Update an existing round
@round_routes.route('/<int:id>', methods=['PUT'])
def update_round(id):
    data = request.get_json()
    round = Round.query.get(id)
    if not round:
        return jsonify({"error": "Round not found"}), 404
    round.scorer_id = data['scorer_id']
    round.attester_id = data['attester_id']
    round.scorecard_image = data.get('scorecard_image')
    db.session.commit()
    return jsonify(round.to_dict())

# Delete a round
@round_routes.route('/<int:id>', methods=['DELETE'])
def delete_round(id):
    round = Round.query.get(id)
    if not round:
        return jsonify({"error": "Round not found"}), 404
    db.session.delete(round)
    db.session.commit()
    return jsonify({"message": "Round deleted successfully"}), 200
