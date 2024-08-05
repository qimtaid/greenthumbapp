from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from models import db, User, Plant, CareSchedule, Tip, ForumPost, GardenLayout

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///greenthumb.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'you-will-never-guess'
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_ACCESS_COOKIE_PATH'] = '/'
app.config['JWT_REFRESH_COOKIE_PATH'] = '/refresh'
app.config['JWT_COOKIE_CSRF_PROTECT'] = False

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already exists"}), 400
    
    new_user = User(username=username, email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"msg": "User registered successfully"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    
    if user is None:
        print("User not found")  # Debug statement
        return jsonify({"msg": "User not found"}), 401
    
    if not user.check_password(password):
        print("Invalid password")  # Debug statement
        return jsonify({"msg": "Invalid password"}), 401
    
    access_token = create_access_token(identity=user.id)
    refresh_token = create_refresh_token(identity=user.id)
    response = make_response(jsonify(access_token=access_token, refresh_token=refresh_token), 200)
    response.set_cookie('jwt', access_token, httponly=True)
    response.set_cookie('refresh_jwt', refresh_token, httponly=True, path='/refresh')
    return response

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    response = make_response(jsonify(access_token=new_access_token), 200)
    response.set_cookie('jwt', new_access_token, httponly=True)
    return response

@app.route('/logout', methods=['POST'])
def logout():
    response = make_response(jsonify({"msg": "Logged out successfully"}), 200)
    response.delete_cookie('jwt')
    response.delete_cookie('refresh_jwt')
    return response

@app.route('/plants', methods=['POST'])
@jwt_required()
def add_plant():
    data = request.get_json()
    name = data.get('name')
    user_id = get_jwt_identity()
    
    new_plant = Plant(name=name, user_id=user_id)
    db.session.add(new_plant)
    db.session.commit()
    
    return jsonify({"msg": "Plant added successfully"}), 201

@app.route('/plants', methods=['GET'])
@jwt_required()
def get_plants():
    user_id = get_jwt_identity()
    plants = Plant.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": plant.id, "name": plant.name} for plant in plants]), 200

@app.route('/plants/<int:plant_id>', methods=['PATCH'])
@jwt_required()
def update_plant(plant_id):
    data = request.get_json()
    plant = Plant.query.get_or_404(plant_id)
    user_id = get_jwt_identity()
    
    if plant.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    if 'name' in data:
        plant.name = data['name']
    
    db.session.commit()
    
    return jsonify({"msg": "Plant updated successfully"}), 200

@app.route('/plants/<int:plant_id>', methods=['DELETE'])
@jwt_required()
def delete_plant(plant_id):
    plant = Plant.query.get_or_404(plant_id)
    user_id = get_jwt_identity()
    
    if plant.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(plant)
    db.session.commit()
    
    return jsonify({"msg": "Plant deleted successfully"}), 200

# Care Schedule Management
@app.route('/plants/<int:plant_id>/schedule', methods=['POST'])
@jwt_required()
def add_care_schedule(plant_id):
    data = request.get_json()
    task = data.get('task')
    schedule_date = data.get('schedule_date')
    new_schedule = CareSchedule(plant_id=plant_id, task=task, schedule_date=schedule_date)
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({"msg": "Care schedule added successfully"}), 201

@app.route('/plants/<int:plant_id>/schedule', methods=['GET'])
@jwt_required()
def get_care_schedules(plant_id):
    schedules = CareSchedule.query.filter_by(plant_id=plant_id).all()
    return jsonify([{"id": schedule.id, "task": schedule.task, "schedule_date": schedule.schedule_date} for schedule in schedules]), 200

# Tips Management
@app.route('/tips', methods=['POST'])
@jwt_required()
def add_tip():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author_id = get_jwt_identity()
    new_tip = Tip(title=title, content=content, author_id=author_id)
    db.session.add(new_tip)
    db.session.commit()
    return jsonify({"msg": "Tip added successfully"}), 201

@app.route('/tips', methods=['GET'])
def get_tips():
    tips = Tip.query.all()
    return jsonify([{"id": tip.id, "title": tip.title, "content": tip.content} for tip in tips]), 200

@app.route('/tips/<int:tip_id>', methods=['PATCH'])
@jwt_required()
def update_tip(tip_id):
    data = request.get_json()
    tip = Tip.query.get_or_404(tip_id)
    user_id = get_jwt_identity()
    
    if tip.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    if 'title' in data:
        tip.title = data['title']
    if 'content' in data:
        tip.content = data['content']
    
    db.session.commit()
    
    return jsonify({"msg": "Tip updated successfully"}), 200

@app.route('/tips/<int:tip_id>', methods=['DELETE'])
@jwt_required()
def delete_tip(tip_id):
    tip = Tip.query.get_or_404(tip_id)
    user_id = get_jwt_identity()
    
    if tip.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(tip)
    db.session.commit()
    
    return jsonify({"msg": "Tip deleted successfully"}), 200

# Forum Post Management
@app.route('/forum', methods=['POST'])
@jwt_required()
def add_forum_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author_id = get_jwt_identity()
    new_post = ForumPost(title=title, content=content, author_id=author_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"msg": "Forum post added successfully"}), 201

@app.route('/forum', methods=['GET'])
def get_forum_posts():
    posts = ForumPost.query.all()
    return jsonify([{"id": post.id, "title": post.title, "content": post.content} for post in posts]), 200

@app.route('/forum/<int:post_id>', methods=['PATCH'])
@jwt_required()
def update_forum_post(post_id):
    data = request.get_json()
    post = ForumPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    
    if post.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    if 'title' in data:
        post.title = data['title']
    if 'content' in data:
        post.content = data['content']
    
    db.session.commit()
    
    return jsonify({"msg": "Forum post updated successfully"}), 200

@app.route('/forum/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_forum_post(post_id):
    post = ForumPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()
    
    if post.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"msg": "Forum post deleted successfully"}), 200

# Garden Layout Management
@app.route('/layouts', methods=['POST'])
@jwt_required()
def add_garden_layout():
    data = request.get_json()
    name = data.get('name')
    layout_data = data.get('layout_data')
    user_id = get_jwt_identity()
    new_layout = GardenLayout(name=name, user_id=user_id, layout_data=layout_data)
    db.session.add(new_layout)
    db.session.commit()
    return jsonify({"msg": "Garden layout added successfully"}), 201

@app.route('/layouts', methods=['GET'])
@jwt_required()
def get_garden_layouts():
    user_id = get_jwt_identity()
    layouts = GardenLayout.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": layout.id, "name": layout.name, "layout_data": layout.layout_data} for layout in layouts]), 200

@app.route('/layouts/<int:layout_id>', methods=['PATCH'])
@jwt_required()
def update_garden_layout(layout_id):
    data = request.get_json()
    layout = GardenLayout.query.get_or_404(layout_id)
    user_id = get_jwt_identity()
    
    if layout.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    if 'name' in data:
        layout.name = data['name']
    if 'layout_data' in data:
        layout.layout_data = data['layout_data']
    
    db.session.commit()
    
    return jsonify({"msg": "Garden layout updated successfully"}), 200

@app.route('/layouts/<int:layout_id>', methods=['DELETE'])
@jwt_required()
def delete_garden_layout(layout_id):
    layout = GardenLayout.query.get_or_404(layout_id)
    user_id = get_jwt_identity()
    
    if layout.user_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(layout)
    db.session.commit()
    
    return jsonify({"msg": "Garden layout deleted successfully"}), 200

# Debugging middleware
@app.before_request
def log_request_info():
    app.logger.debug('Headers: %s', request.headers)
    app.logger.debug('Body: %s', request.get_data())

@app.after_request
def log_response_info(response):
    app.logger.debug('Response: %s', response.get_data())
    return response

if __name__ == '__main__':
    app.run()
