# app/seeds/seed.py (or another appropriate seed file)

from app.models import db, Setting

def seed_settings():
    setting = Setting(season_round_limit=8)
    db.session.add(setting)
    db.session.commit()

def undo_settings():
    db.session.execute("DELETE FROM settings;")
    db.session.commit()
