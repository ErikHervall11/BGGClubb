# app/models/setting.py
from app.models.db import db
from sqlalchemy.sql import func

class Setting(db.Model):
    __tablename__ = 'settings'

    id = db.Column(db.Integer, primary_key=True)
    season_round_limit = db.Column(db.Integer, nullable=False, default=8)

    def to_dict(self):
        return {
            "id": self.id,
            "season_round_limit": self.season_round_limit,
        }
