from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenthumb.db'  # Update for your database
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)
jqt = JWTManager(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class Plant(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    care_schedules = db.relationship('CareSchedule', backref='plant', lazy=True)

class CareSchedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    plant_id = db.Column(db.Integer, db.ForeignKey('plant.id'))
    task = db.Column(db.String(64), nullable=False)
    schedule_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

class Tip(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author_id = db.Column(db.Integer, db.ForeignKey('user.id'))

class GardenLayout(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    layout_data = db.Column(db.Text, nullable=False)

# CRUD Operations for Plants

@app.route('/plants', methods=['GET'])
def get_plants():
    plants = Plant.query.all()
    return jsonify([plant.to_dict() for plant in plants])

@app.route('/plants', methods=['POST'])
def create_plant():
    data = request.json
    plant = Plant(name=data['name'], user_id=data['user_id'])
    db.session.add(plant)
    db.session.commit()
    return jsonify(plant.to_dict()), 201

@app.route('/plants/<int:id>', methods=['DELETE'])
def delete_plant(id):
    plant = Plant.query.get_or_404(id)
    db.session.delete(plant)
    db.session.commit()
    return '', 204

# CRUD Operations for CareSchedules

@app.route('/plants/<int:plant_id>/schedule', methods=['GET'])
def get_care_schedules(plant_id):
    schedules = CareSchedule.query.filter_by(plant_id=plant_id).all()
    return jsonify([schedule.to_dict() for schedule in schedules])

@app.route('/plants/<int:plant_id>/schedule', methods=['POST'])
def create_care_schedule(plant_id):
    data = request.json
    schedule = CareSchedule(task=data['task'], schedule_date=datetime.utcnow(), plant_id=plant_id)
    db.session.add(schedule)
    db.session.commit()
    return jsonify(schedule.to_dict()), 201

@app.route('/plants/<int:plant_id>/schedule/<int:schedule_id>', methods=['DELETE'])
def delete_care_schedule(plant_id, schedule_id):
    schedule = CareSchedule.query.get_or_404(schedule_id)
    db.session.delete(schedule)
    db.session.commit()
    return '', 204

# CRUD Operations for Tips

@app.route('/tips', methods=['GET'])
def get_tips():
    tips = Tip.query.all()
    return jsonify([tip.to_dict() for tip in tips])

@app.route('/tips', methods=['POST'])
def create_tip():
    data = request.json
    tip = Tip(title=data['title'], content=data['content'], author_id=data['author_id'])
    db.session.add(tip)
    db.session.commit()
    return jsonify(tip.to_dict()), 201

@app.route('/tips/<int:id>', methods=['DELETE'])
def delete_tip(id):
    tip = Tip.query.get_or_404(id)
    db.session.delete(tip)
    db.session.commit()
    return '', 204

# CRUD Operations for ForumPosts

@app.route('/forum', methods=['GET'])
def get_forum_posts():
    posts = ForumPost.query.all()
    return jsonify([post.to_dict() for post in posts])

@app.route('/forum', methods=['POST'])
def create_forum_post():
    data = request.json
    post = ForumPost(title=data['title'], content=data['content'], author_id=data['author_id'])
    db.session.add(post)
    db.session.commit()
    return jsonify(post.to_dict()), 201

@app.route('/forum/<int:id>', methods=['DELETE'])
def delete_forum_post(id):
    post = ForumPost.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return '', 204

# CRUD Operations for GardenLayouts

@app.route('/layouts', methods=['GET'])
def get_garden_layouts():
    layouts = GardenLayout.query.all()
    return jsonify([layout.to_dict() for layout in layouts])

@app.route('/layouts', methods=['POST'])
def create_garden_layout():
    data = request.json
    layout = GardenLayout(name=data['name'], user_id=data['user_id'], layout_data=data['layout_data'])
    db.session.add(layout)
    db.session.commit()
    return jsonify(layout.to_dict()), 201

@app.route('/layouts/<int:id>', methods=['DELETE'])
def delete_garden_layout(id):
    layout = GardenLayout.query.get_or_404(id)
    db.session.delete(layout)
    db.session.commit()
    return '', 204

if __name__ == '__main__':
    app.run(debug=True)
