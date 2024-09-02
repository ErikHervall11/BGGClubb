from app.models.db import db
from sqlalchemy.sql import func

class Score(db.Model):
    __tablename__ = 'scores'

    id = db.Column(db.Integer, primary_key=True)
    round_id = db.Column(db.Integer, db.ForeignKey('rounds.id'), nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    hole_number = db.Column(db.Integer, nullable=False)
    strokes = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    round = db.relationship('Round', back_populates='scores')
    player = db.relationship('Player', back_populates='scores')


    def to_dict(self):
        return {
            'id': self.id,
            'round_id': self.round_id,
            'player_id': self.player_id,
            'hole_number': self.hole_number,
            'strokes': self.strokes,
            'player': self.player.to_dict() if self.player else None,  # Include player data
        }