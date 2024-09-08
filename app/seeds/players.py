from app.models import db, Player, environment, SCHEMA
from sqlalchemy.sql import text

def seed_players():
    players = [
        Player(name='Alison Dumont'),
        Player(name='Amy Zollars'),
        Player(name='Andi Carvalho'),
        Player(name='April Miller'),
        Player(name='Barb Ryan'),
        Player(name='Betty Faulkner'),
        Player(name='Candace Washing'),
        Player(name='Cara Caindec'),
        Player(name='Cara Gulati'),
        Player(name='Carla Soares'),
        Player(name='Carol O\'Connell'),
        Player(name='Catherine Cox'),
        Player(name='Chris Fitzsimons'),
        Player(name='Cynthia Ermshar'),
        Player(name='Coco Tompkins'),
        Player(name='Cora Versaggi'),
        Player(name='Dana Marshall'),
        Player(name='Danielle Siler'),
        Player(name='Deb Bennett'),
        Player(name='Debbie Woo'),
        Player(name='Diana Amo'),
        Player(name='Elena Torres'),
        Player(name='Elizabeth Ure'),
        Player(name='Fabiola Saballos'),
        Player(name='Felice Gold'),
        Player(name='Gail Morrill'),
        Player(name='Gina Soares'),
        Player(name='Jamie Staskus'),
        Player(name='Jeannie Vukasovich'),
        Player(name='Jen Haskell'),
        Player(name='Jennifer Baldwin'),
        Player(name='Jennifer Stevens'),
        Player(name='Jennifer Swartz'),
        Player(name='Jodi McLean'),
        Player(name='Judy Hervall'),
        Player(name='Julie Schreader'),
        Player(name='Julie Wellik'),
        Player(name='Kara Taub'),
        Player(name='Kate Kropf'),
        Player(name='Kathryn Chipman'),
        Player(name='Kate Ratto'),
        Player(name='Katie Kitching'),
        Player(name='Kristel Frank'),
        Player(name='Laraine Gittens'),
        Player(name='Laura Adler'),
        Player(name='Laura Schierberl'),
        Player(name='Leslie Ruhland'),
        Player(name='Linda Reid'),
        Player(name='Lisa Sanchez-O\'Brien'),
        Player(name='Lisa Taylor'),
        Player(name='Lise Ciolino'),
        Player(name='Liz Love'),
        Player(name='Lorena Norman'),
        Player(name='Lorrie Serna'),
        Player(name='Maria Chapman'),
        Player(name='Marie O\'Dea'),
        Player(name='Marsha Silberstein'),
        Player(name='Maryanna Chmielewski'),
        Player(name='Maureen Carlin'),
        Player(name='Michele Miller'),
        Player(name='Monique von Sheven'),
        Player(name='Nicolette (Nikki) Sloan'),
        Player(name='Pat Workman'),
        Player(name='Randi Curhan'),
        Player(name='Randy Toll McKillop'),
        Player(name='Rosemary LaPuma'),
        Player(name='Sarah Finegold'),
        Player(name='Shannon Jamieson'),
        Player(name='Sharna Brockett'),
        Player(name='Shawna Levi'),
        Player(name='Sherrie Vigneron'),
        Player(name='Stacy Cheregotis'),
        Player(name='Stephanie Shimek'),
        Player(name='Susan Keller'),
        Player(name='Susan Woodhouse'),
        Player(name='Teresa Friedman'),
        Player(name='Tina Schilling'),
        Player(name='Vivian Richardson'),
        Player(name='Winnie Caulkins')
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
