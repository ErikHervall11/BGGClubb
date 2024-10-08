from app.models.db import db
from sqlalchemy.sql import func
from .db import db, add_prefix_for_prod, environment, SCHEMA

class Player(db.Model):
    __tablename__ = 'players'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    profile_image = db.Column(db.String)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    # Relationships
    scores = db.relationship('Score', back_populates='player', cascade="all, delete-orphan")
    best_scores = db.relationship('BestScore', back_populates='player')
    scorer_rounds = db.relationship('Round', foreign_keys='Round.scorer_id', back_populates='scorer')
    attester_rounds = db.relationship('Round', foreign_keys='Round.attester_id', back_populates='attester')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
        }