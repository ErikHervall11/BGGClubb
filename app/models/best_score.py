from app.models.db import db
from sqlalchemy.sql import func

class BestScore(db.Model):
    __tablename__ = 'best_scores'

    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    hole_number = db.Column(db.Integer, nullable=False)
    best_strokes = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    player = db.relationship('Player', back_populates='best_scores')
