from app.models import db, Player, environment, SCHEMA
from sqlalchemy.sql import text

def seed_players():
    players = [
        Player(name='Player 1'),
        Player(name='Player 2'),
        Player(name='Player 3'),
        Player(name='Player 4'),
    ]

    for player in players:
        db.session.add(player)

    db.session.commit()

def undo_players():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.players RESTART IDENTITY CASCADE;")
    else:
        db.session.execute("DELETE FROM players;")
    db.session.commit()
