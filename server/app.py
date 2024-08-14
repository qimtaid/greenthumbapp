from flask import Flask, request, send_from_directory, jsonify, make_response, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager, create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from datetime import datetime
from models import db, User, Plant, CareSchedule, Tips, ForumPost, GardenLayout, Comment  # Ensure Comment model is imported

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
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

CORS(app, supports_credentials=True)

db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

# Remove Flask-Mail configuration
# app.config['MAIL_SERVER'] = 'smtp.gmail.com'
# app.config['MAIL_PORT'] = 587
# app.config['MAIL_USERNAME'] = 'tuvibestu@gmail.com'
# app.config['MAIL_PASSWORD'] = '@tracy31'
# app.config['MAIL_USE_TLS'] = True
# app.config['MAIL_USE_SSL'] = False

# Remove Mail initialization
# mail = Mail(app)

def check_due_schedules():
    with app.app_context():
        due_schedules = CareSchedule.query.filter(CareSchedule.is_due()).all()
        for schedule in due_schedules:
            user = User.query.get(schedule.plant.user_id)
            if user:
                # Implement logic to notify user within the app
                # Example: Save notification or update status in the database
                pass  # Implement in-app notification handling here



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
        return jsonify({"msg": "User not found"}), 401
    
    if not user.check_password(password):
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
    name = request.form.get('name')
    description = request.form.get('description')
    user_id = get_jwt_identity()
    img_url = None

    if not name:
        return jsonify({"error": "Plant name is required"}), 400

    # Check if an image file is included in the request
    if 'image' in request.files:
        file = request.files['image']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            img_url = url_for('uploaded_file', filename=filename, _external=True)

    # Create and save the new plant record
    new_plant = Plant(name=name, img_url=img_url, description=description, user_id=user_id)
    db.session.add(new_plant)
    db.session.commit()

    return jsonify({"msg": "Plant added successfully", "img_url": img_url}), 201

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
# Tips Management
@app.route('/tips', methods=['POST'])
@jwt_required()
def add_tip():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author_id = get_jwt_identity()
    new_tip = Tips(title=title, content=content, author_id=author_id)  # Updated variable name
    db.session.add(new_tip)  # Updated variable name
    db.session.commit()
    return jsonify({"msg": "Tip added successfully"}), 201

@app.route('/tips', methods=['GET'])
def get_tips():
    tips = Tips.query.all()
    return jsonify([{"id": tip.id, "title": tip.title, "content": tip.content, "author_id": tip.author_id} for tip in tips]), 200

@app.route('/tips/<int:tip_id>', methods=['PATCH'])
@jwt_required()
def update_tip(tip_id):
    data = request.get_json()
    tip = Tips.query.get_or_404(tip_id)  # Corrected variable name
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
    tip = Tips.query.get_or_404(tip_id)  # Corrected variable name
    user_id = get_jwt_identity()

    if tip.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(tip)  # Corrected variable name
    db.session.commit()
    
    return jsonify({"msg": "Tip deleted successfully"}), 200


# Forum Posts Management
@app.route('/forum', methods=['POST'])
@jwt_required()
def create_post():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author_id = get_jwt_identity()
    new_post = ForumPost(title=title, content=content, author_id=author_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({"msg": "Post created successfully"}), 201

@app.route('/forum', methods=['GET'])
def get_posts():
    posts = ForumPost.query.all()
    return jsonify([{"id": post.id, "title": post.title, "content": post.content, "author_id": post.author_id} for post in posts]), 200

@app.route('/forum/<int:post_id>', methods=['PATCH'])
@jwt_required()
def update_post(post_id):
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
    
    return jsonify({"msg": "Post updated successfully"}), 200

@app.route('/forum/<int:post_id>', methods=['DELETE'])
@jwt_required()
def delete_post(post_id):
    post = ForumPost.query.get_or_404(post_id)
    user_id = get_jwt_identity()

    if post.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(post)
    db.session.commit()
    
    return jsonify({"msg": "Post deleted successfully"}), 200

# Forum Comments Management
@app.route('/forum/<int:post_id>/comments', methods=['POST'])
@jwt_required()
def add_comment(post_id):
    data = request.get_json()
    content = data.get('content')
    author_id = get_jwt_identity()
    new_comment = Comment(content=content, post_id=post_id, author_id=author_id)
    db.session.add(new_comment)
    db.session.commit()
    return jsonify({"msg": "Comment added successfully"}), 201

@app.route('/forum/<int:post_id>/comments', methods=['GET'])
def get_comments(post_id):
    comments = Comment.query.filter_by(post_id=post_id).all()
    return jsonify([{"id": comment.id, "content": comment.content, "author_id": comment.author_id} for comment in comments]), 200

@app.route('/forum/comments/<int:comment_id>', methods=['PATCH'])
@jwt_required()
def update_comment(comment_id):
    data = request.get_json()
    comment = Comment.query.get_or_404(comment_id)
    user_id = get_jwt_identity()

    if comment.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403

    if 'content' in data:
        comment.content = data['content']
    
    db.session.commit()
    
    return jsonify({"msg": "Comment updated successfully"}), 200

@app.route('/forum/comments/<int:comment_id>', methods=['DELETE'])
@jwt_required()
def delete_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    user_id = get_jwt_identity()

    if comment.author_id != user_id:
        return jsonify({"msg": "Unauthorized"}), 403
    
    db.session.delete(comment)
    db.session.commit()
    
    return jsonify({"msg": "Comment deleted successfully"}), 200

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    if not user:
        return jsonify({"msg": "User not found"}), 404
    return jsonify({"username": user.username, "email": user.email}), 200

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True)
