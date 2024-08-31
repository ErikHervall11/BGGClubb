# app/api/player_routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Player

player_routes = Blueprint('players', __name__)

# Get all players
@player_routes.route('/', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([player.to_dict() for player in players])

# Get a single player by ID
@player_routes.route('/<int:id>', methods=['GET'])
def get_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    return jsonify(player.to_dict())

# Create a new player
@player_routes.route('/', methods=['POST'])
def create_player():
    data = request.get_json()
    new_player = Player(name=data['name'])
    db.session.add(new_player)
    db.session.commit()
    return jsonify(new_player.to_dict()), 201

# Update an existing player
@player_routes.route('/<int:id>', methods=['PUT'])
def update_player(id):
    data = request.get_json()
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    player.name = data['name']
    db.session.commit()
    return jsonify(player.to_dict())

# Delete a player
@player_routes.route('/<int:id>', methods=['DELETE'])
def delete_player(id):
    player = Player.query.get(id)
    if not player:
        return jsonify({"error": "Player not found"}), 404
    db.session.delete(player)
    db.session.commit()
    return jsonify({"message": "Player deleted successfully"}), 200
