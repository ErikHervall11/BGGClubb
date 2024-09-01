# app/api/round_routes.py

import os
from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from app.models import db, Round, Score, Player
from flask_login import login_required, current_user


round_routes = Blueprint('rounds', __name__)

# Define the upload folder directly in this file
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'heic'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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
    scorer_id = request.form.get('scorer_id')
    attester_id = request.form.get('attester_id')
    scores = request.form.to_dict(flat=False)  # Handle scores as needed
    photo = request.files.get('photo')

    # Handle the file upload
    if photo and allowed_file(photo.filename):
        filename = secure_filename(photo.filename)
        photo.save(os.path.join(UPLOAD_FOLDER, filename))
        photo_path = os.path.join(UPLOAD_FOLDER, filename)  # Store this in the database

        # Create a new Round instance with the photo path
        new_round = Round(
            scorer_id=scorer_id,
            attester_id=attester_id,
            scorecard_image=photo_path  # Save the path in the database
        )

        db.session.add(new_round)
        db.session.commit()
        
        # Process scores
        for key, values in scores.items():
            print(f"Processing key: {key} with values: {values}")  # Debugging statement
            if key.startswith('scores'):
                player_id = int(key.split('[')[1].split(']')[0])
                hole_number = int(key.split('[')[2].split(']')[0])  # Extract the hole number from the key
                for strokes in values:
                    if strokes:  # Check if strokes are provided
                        new_score = Score(
                            round_id=new_round.id,
                            player_id=player_id,
                            hole_number=hole_number,
                            strokes=int(strokes)
                        )
                        db.session.add(new_score)
                    

        db.session.commit()

        return jsonify(new_round.to_dict()), 201
    else:
        return jsonify({"error": "File upload failed or invalid file type"}), 400

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
@round_routes.route('/admin/delete_round/<int:id>', methods=['DELETE'])
@login_required
def delete_round(id):
    if not current_user.is_admin:
        return {'errors': {'message': 'Unauthorized'}}, 403

    round = Round.query.get(id)
    if not round:
        return jsonify({"error": "Round not found"}), 404
    db.session.delete(round)
    db.session.commit()
    return jsonify({"message": "Round deleted successfully"}), 200
