from datetime import datetime, timedelta
from enum import Enum
from werkzeug.security import generate_password_hash, check_password_hash
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    plants = db.relationship('Plant', back_populates='owner', lazy=True)
    tips = db.relationship('Tips', back_populates='author', lazy=True)
    forum_posts = db.relationship('ForumPost', back_populates='author', lazy=True)
    garden_layouts = db.relationship('GardenLayout', back_populates='owner', lazy=True)
    comments = db.relationship('Comment', back_populates='author', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    img_url = db.Column(db.String(255), nullable=True)
    description = db.Column(db.String(500))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    owner = db.relationship('User', back_populates='plants')
    care_schedules = db.relationship('CareSchedule', back_populates='plant', lazy=True)

class CareType(Enum):
    WATERING = "Watering"
    PRUNING = "Pruning"
    FERTILIZING = "Fertilizing"
    HARVESTING = "Harvesting"

class ScheduleInterval(Enum):
    DAILY = "Daily"
    WEEKLY = "Weekly"
    MONTHLY = "Monthly"

class CareSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'))
    task = db.Column(db.Enum(CareType), nullable=False)
    schedule_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    interval = db.Column(db.Enum(ScheduleInterval), nullable=False, default=ScheduleInterval.DAILY)

    plant = db.relationship('Plant', back_populates='care_schedules')

    def next_due_date(self):
        if self.interval == ScheduleInterval.DAILY:
            return self.schedule_date + timedelta(days=1)
        elif self.interval == ScheduleInterval.WEEKLY:
            return self.schedule_date + timedelta(weeks=1)
        elif self.interval == ScheduleInterval.MONTHLY:
            return self.schedule_date + timedelta(weeks=4)  # Approximation for a month
        return self.schedule_date

    def is_due(self):
        return datetime.utcnow() >= self.next_due_date()

class Tips(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    author = db.relationship('User', back_populates='tips')

class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    post = db.relationship('ForumPost', back_populates='comments')
    author = db.relationship('User', back_populates='comments')

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    author = db.relationship('User', back_populates='forum_posts')
    comments = db.relationship('Comment', back_populates='post', lazy=True)

    def __repr__(self):
        return f'<ForumPost {self.title}>'

class GardenLayout(db.Model):
    # Remove the __tablename__ attribute
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    owner = db.relationship('User', back_populates='garden_layouts')
    layout_data = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<GardenLayout(id={self.id}, name={self.name}, user_id={self.user_id})>"

