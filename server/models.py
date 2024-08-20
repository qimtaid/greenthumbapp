from datetime import datetime
import json
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    # Relationships
    plants = db.relationship('Plant', backref='user', lazy=True)
    tips = db.relationship('Tip', backref='user', lazy=True)
    layouts = db.relationship('Layout', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    img_url = db.Column(db.String(255))
    description = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    care_schedules = db.relationship('CareSchedule', backref='plant', lazy=True)

    def __repr__(self):
        return f'<Plant {self.name}>'

class CareSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(80), nullable=False)
    schedule_date = db.Column(db.Date, nullable=False)
    interval = db.Column(db.String(50), nullable=True)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'), nullable=False)  # Ensure this column is not nullable
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Ensure this column is not nullable

    def to_dict(self):
        return {
            'id': self.id,
            'task': self.task,
            'schedule_date': self.schedule_date.strftime('%Y-%m-%d'),
            'interval': self.interval,
            'plant_id': self.plant_id,
            'plant_name': self.plant.name,
            'user_id': self.user_id
        }

    def __repr__(self):
        return f'<CareSchedule {self.task} for Plant ID {self.plant_id}>'

class Tip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'created_at': self.created_at.isoformat(),
            'author': self.user.username  # Access `user` relationship
        }


""" class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Relationship to User with a unique backref name
    author = db.relationship('User', backref=db.backref('posts', lazy=True))

    comments = db.relationship('Comment', backref='post', lazy=True, cascade='all, delete-orphan')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'timestamp': self.timestamp,
            'author': self.author.username,
            'comments': [comment.to_dict() for comment in self.comments],
        } """


    

""" class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())
    post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'content': self.content,
            'timestamp': self.timestamp,
            'author': self.author.username,
        } """


class Layout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    layout_data = db.Column(db.Text, nullable=False)  # Store the layout data as a JSON string
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'layout_data': json.loads(self.layout_data), 
            'user_id': self.user_id,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }