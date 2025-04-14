# app/models.py
from __init__ import db
from flask_login import UserMixin
from sqlalchemy import func


#Create User Model/DB Table - One to Many Relationship with Anime Model
#Every row is new user, every column is info about user

class User(db.Model, UserMixin): #inherts from db model
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True)
    email = db.Column(db.String(150), unique=True)
    image_file = db.Column(db.String(20), nullable=False, default='default.jpg')
    password = db.Column(db.String(150))
    date_created = db.Column(db.DateTime(timezone=True), default = func.now())
    animes = db.relationship('Anime', backref='author', lazy=True) #relationship between user and anime table


#Create Anime Model/DB Table
#Every row is new anime, every column is info about anime

class Anime(db.Model, UserMixin): #inherts from db model
    __tablename__ = 'anime'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(150), unique=True)
    genres = db.Column(db.String(150))
    synopsis = db.Column(db.Text)
    episodes = db.Column(db.Integer)
    status = db.Column(db.String(150))
    main_picture = db.Column(db.String(500), )
    user_id = db.Column(db.Integer, db.ForeignKey('users.id')) #foreign key to user table