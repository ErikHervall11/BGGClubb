from app.models.db import db
from sqlalchemy.sql import func

class Round(db.Model):
    __tablename__ = 'rounds'

    id = db.Column(db.Integer, primary_key=True)
    scorer_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    attester_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    scorecard_image = db.Column(db.String)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    scores = db.relationship('Score', back_populates='round')
    scorer = db.relationship('Player', foreign_keys=[scorer_id], back_populates='scorer_rounds')
    attester = db.relationship('Player', foreign_keys=[attester_id], back_populates='attester_rounds')
