from datetime import datetime
from flask import Flask, request, send_from_directory, jsonify, make_response, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
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
app.config['UPLOAD_FOLDER'] = 'uploads' 
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16 MB

CORS(app, supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "Welcome to the GreenThumb app!"}), 200

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
    data = request.json  # Expecting JSON data

    name = data.get('name')
    description = data.get('description')
    img_url = data.get('img_url')
    user_id = get_jwt_identity()

    if not name:
        return jsonify({"error": "Plant name is required"}), 400

    if not img_url:
        return jsonify({"error": "Image URL is required"}), 400

    # Save the plant details to the database
    new_plant = Plant(name=name, description=description, img_url=img_url, user_id=user_id)
    db.session.add(new_plant)
    db.session.commit()

    return jsonify({"message": "Plant added successfully"}), 201


@app.route('/plants', methods=['GET'])
@jwt_required()
def get_plants():
    user_id = get_jwt_identity()
    plants = Plant.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": plant.id, "name": plant.name, "img_url": plant.img_url, "description": plant.description} for plant in plants]), 200

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
    if 'img_url' in data:
        plant.img_url = data['img_url'] 
    if 'description' in data:
        plant.description = data['description']
    
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

# CareSchedule CRUD
@app.route('/care_schedules', methods=['POST'])
@jwt_required()
def add_care_schedule():
    data = request.get_json()
    print(f"Received data: {data}")  # Debugging line

    task = data.get('task')
    schedule_date = data.get('schedule_date')
    interval = data.get('interval')
    plant_id = data.get('plant_id')
    user_id = get_jwt_identity()

    if not task or not schedule_date or not plant_id:
        return jsonify({"error": "Task, Schedule Date, and Plant are required"}), 400

    # Check if the plant exists
    plant = Plant.query.get(plant_id)
    if not plant:
        return jsonify({"error": "Plant not found"}), 404

    new_schedule = CareSchedule(
        task=task,
        schedule_date=datetime.strptime(schedule_date, '%Y-%m-%d'),
        interval=interval,
        plant_id=plant_id,
        user_id=user_id
    )
    db.session.add(new_schedule)
    db.session.commit()

    return jsonify({"msg": "Care schedule added successfully", "schedule": new_schedule.to_dict()}), 201


@app.route('/care_schedules', methods=['GET', 'OPTIONS'])
@jwt_required()
def get_care_schedules():
    if request.method == 'OPTIONS':
        return jsonify({}), 200
    
    try:
        user_id = get_jwt_identity()
        schedules = CareSchedule.query.filter_by(user_id=user_id).all()

        if not schedules:
            return jsonify({"message": "No care schedules found."}), 404
        
        return jsonify([schedule.to_dict() for schedule in schedules]), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/care_schedules/<int:id>', methods=['PATCH'])
@jwt_required()
def update_care_schedule(id):
    schedule = CareSchedule.query.get_or_404(id)
    user_id = get_jwt_identity()

    if schedule.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    schedule.task = request.json.get('task', schedule.task)
    schedule.schedule_date = datetime.strptime(request.json.get('schedule_date', schedule.schedule_date.strftime('%Y-%m-%d')), '%Y-%m-%d')
    schedule.interval = request.json.get('interval', schedule.interval)
    
    db.session.commit()
    return jsonify({"msg": "Care schedule updated successfully", "schedule": schedule.to_dict()}), 200

@app.route('/care_schedules/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_care_schedule(id):
    schedule = CareSchedule.query.get_or_404(id)
    user_id = get_jwt_identity()

    if schedule.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    db.session.delete(schedule)
    db.session.commit()
    return jsonify({"msg": "Care schedule deleted successfully"}), 200

# Route to fetch all tips
@app.route('/tips', methods=['GET'])
@jwt_required()
def get_tips():
    tips = Tip.query.all()
    tips_list = [{'id': tip.id, 'title': tip.title, 'content': tip.content, 'author': tip.user.username} for tip in tips]
    return jsonify(tips_list), 200

# Route to add a new tip
@app.route('/tips', methods=['POST'])
@jwt_required()
def add_tip():
    data = request.json
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404

    new_tip = Tip(title=data['title'], content=data['content'], user_id=user.id)
    db.session.add(new_tip)
    db.session.commit()

    return jsonify({'message': 'Tip added successfully'}), 201

# Route to update an existing tip
@app.route('/tips/<int:tip_id>', methods=['PATCH'])
@jwt_required()
def update_tip(tip_id):
    try:
        data = request.json
        tip = Tip.query.get(tip_id)
        if not tip:
            return jsonify({'error': 'Tip not found'}), 404

        current_user_id = get_jwt_identity()

        if tip.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized action'}), 403

        if 'title' in data:
            tip.title = data['title']
        if 'content' in data:
            tip.content = data['content']

        db.session.commit()

        return jsonify({'message': 'Tip updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Route to delete a tip
@app.route('/tips/<int:tip_id>', methods=['DELETE'])
@jwt_required()
def delete_tip(tip_id):
    try:
        tip = Tip.query.get(tip_id)
        if not tip:
            return jsonify({'error': 'Tip not found'}), 404

        current_user_id = get_jwt_identity()

        if tip.user_id != current_user_id:
            return jsonify({'error': 'Unauthorized action'}), 403

        db.session.delete(tip)
        db.session.commit()

        return jsonify({'message': 'Tip deleted successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


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

# File upload endpoint
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

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
