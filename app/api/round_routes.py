# app/api/round_routes.py
from flask import Blueprint, jsonify, request, current_app
from app.models import db, Round, Score, Player
from app.api.AWS_helpers import upload_file_to_s3, get_unique_filename, remove_file_from_s3
from flask_login import login_required, current_user



round_routes = Blueprint('rounds', __name__)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'heic'}


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@round_routes.route('/player/<int:player_id>', methods=['GET'])
def get_player_rounds(player_id):
    rounds = Round.query.join(Score).filter(Score.player_id == player_id).all()
    rounds_data = []
    for round in rounds:
        round_dict = round.to_dict()  # Assuming to_dict method includes necessary relationships
        rounds_data.append(round_dict)
    
    return jsonify(rounds_data)

# Get all rounds
@round_routes.route('/', methods=['GET'])
def get_rounds():
    rounds = Round.query.all()
    return jsonify([round.to_dict() for round in rounds])

@round_routes.route('/recent', methods=['GET'])
def get_recent_rounds():
    rounds = Round.query.order_by(Round.created_at.desc()).all()
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
    scores = request.form.to_dict(flat=False)
    photo = request.files.get('photo')

     # Handle the file upload to AWS S3
    if photo and allowed_file(photo.filename):
        photo.filename = get_unique_filename(photo.filename)  # Get a unique filename
        upload = upload_file_to_s3(photo)

        if "url" not in upload:
            return jsonify({"error": "File upload to S3 failed"}), 400

        photo_url = upload["url"]  # Get the public S3 URL of the uploaded photo

        # Create a new Round instance with the S3 photo URL
        new_round = Round(
            scorer_id=scorer_id,
            attester_id=attester_id,
            scorecard_image=photo_url  # Save the S3 URL to the database
        )

        db.session.add(new_round)
        db.session.commit()
        
        # Process scores
        for key, values in scores.items():
            # print(f"Processing key: {key} with values: {values}")  # Debugging statement
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
