# app/models/setting.py
from app.models.db import db
from sqlalchemy.sql import func
from .db import db, add_prefix_for_prod, environment, SCHEMA

class Setting(db.Model):
    __tablename__ = 'settings'
    
    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    season_round_limit = db.Column(db.Integer, nullable=False, default=8)

    def to_dict(self):
        return {
            "id": self.id,
            "season_round_limit": self.season_round_limit,
        }
