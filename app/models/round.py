from app.models.db import db
from sqlalchemy.sql import func
from .db import db, add_prefix_for_prod, environment, SCHEMA

class Round(db.Model):
    __tablename__ = 'rounds'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    scorer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('players.id')), nullable=False)
    attester_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('players.id')), nullable=False)
    scorecard_image = db.Column(db.String)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    scores = db.relationship('Score', back_populates='round', cascade="all, delete-orphan")
    scorer = db.relationship('Player', foreign_keys=[scorer_id], back_populates='scorer_rounds')
    attester = db.relationship('Player', foreign_keys=[attester_id], back_populates='attester_rounds')

    def to_dict(self):
        return {
            'id': self.id,
            'scorer_id': self.scorer_id,
            'attester_id': self.attester_id,
            'scorecard_image': self.scorecard_image,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'scores': [score.to_dict() for score in self.scores], 
            'scorer': self.scorer.to_dict(),  
            'attester': self.attester.to_dict(),  
        }
