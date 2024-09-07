# app/api/player_routes.py

from flask import Blueprint, jsonify, request
from app.models import db, Player, Round, Score

player_routes = Blueprint('players', __name__)

@player_routes.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    players = Player.query.all()
    leaderboard = []

    for player in players:
        best_scores = Score.query.filter(Score.player_id == player.id)\
                                 .order_by(Score.hole_number)\
                                 .distinct(Score.hole_number)\
                                 .limit(9)\
                                 .all()
        total_score = sum(score.strokes for score in best_scores)

        leaderboard.append({
            "player_name": player.name,
            "scores": [score.strokes for score in best_scores],
            "total_score": total_score
        })

    # Sort leaderboard by total_score (ascending) and get the top 3 players
    leaderboard = sorted(leaderboard, key=lambda x: x["total_score"])[:3]

    return jsonify(leaderboard)

# # Get all players
# @player_routes.route('/', methods=['GET'])
# def get_players():
#     players = Player.query.all()
#     return jsonify([player.to_dict() for player in players])

# ###########

# Create a new player



@player_routes.route('/', methods=['GET'])
def get_players():
    players = Player.query.all()
    player_list = []

    for player in players:
        # Count the number of rounds where the player has actually submitted scores
        rounds_played = Round.query.join(Score).filter(
            Score.player_id == player.id
        ).distinct().count()

        player_data = player.to_dict()
        player_data['rounds_played'] = rounds_played
        player_list.append(player_data)

    return jsonify(player_list)


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
