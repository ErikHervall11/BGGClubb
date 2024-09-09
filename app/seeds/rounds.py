# from app.models import db, Round, Score, environment, SCHEMA
# from sqlalchemy.sql import text

# def seed_rounds():
#     round1 = Round(scorer_id=1, attester_id=2, scorecard_image='https://bad-girls-golf-club.s3.us-west-1.amazonaws.com/McginnisGolfCourseScorecard1.png')
#     round2 = Round(scorer_id=2, attester_id=3, scorecard_image='https://bad-girls-golf-club.s3.us-west-1.amazonaws.com/McginnisGolfCourseScorecard1.png')

#     scores = [
#         Score(round_id=1, player_id=1, hole_number=1, strokes=4),
#         Score(round_id=1, player_id=1, hole_number=2, strokes=5),
#         Score(round_id=1, player_id=1, hole_number=3, strokes=3),
#         Score(round_id=1, player_id=1, hole_number=4, strokes=3),
#         Score(round_id=1, player_id=1, hole_number=5, strokes=6),
#         Score(round_id=1, player_id=1, hole_number=6, strokes=3),
#         Score(round_id=1, player_id=1, hole_number=7, strokes=4),
#         Score(round_id=1, player_id=1, hole_number=8, strokes=5),
#         Score(round_id=1, player_id=1, hole_number=9, strokes=5),
        
        

#         # Add more scores for round1
#         Score(round_id=2, player_id=2, hole_number=1, strokes=3),
#         Score(round_id=2, player_id=2, hole_number=2, strokes=4),
#         Score(round_id=2, player_id=2, hole_number=3, strokes=3),
#         Score(round_id=2, player_id=2, hole_number=4, strokes=4),
#         Score(round_id=2, player_id=2, hole_number=5, strokes=4),
#         Score(round_id=2, player_id=2, hole_number=6, strokes=6),
#         Score(round_id=2, player_id=2, hole_number=7, strokes=4),
#         Score(round_id=2, player_id=2, hole_number=8, strokes=3),
#         Score(round_id=2, player_id=2, hole_number=9, strokes=3),
#         # Add more scores for round2
#     ]

#     db.session.add(round1)
#     db.session.add(round2)
#     db.session.add_all(scores)

#     db.session.commit()

# def undo_rounds():
#     if environment == "production":
#         db.session.execute(f"TRUNCATE table {SCHEMA}.rounds RESTART IDENTITY CASCADE;")
#         db.session.execute(f"TRUNCATE table {SCHEMA}.scores RESTART IDENTITY CASCADE;")
#     else:
#         db.session.execute("DELETE FROM rounds;")
#         db.session.execute("DELETE FROM scores;")
#     db.session.commit()
