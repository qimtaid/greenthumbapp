from flask import Blueprint, request, jsonify
from models import db, Tip, ForumPost
from flask_jwt_extended import jwt_required, get_jwt_identity

community_bp = Blueprint('community', __name__)

@community_bp.route('/tips', methods=['POST'])
@jwt_required()
def add_tip():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_tip = Tip(content=data['content'], user_id=user_id)
    db.session.add(new_tip)
    db.session.commit()
    return jsonify({'message': 'Tip added successfully'}), 201

@community_bp.route('/tips', methods=['GET'])
@jwt_required()
def get_tips():
    tips = Tip.query.all()
    return jsonify([tip.as_dict() for tip in tips]), 200

@community_bp.route('/tips/<int:id>', methods=['PUT'])
@jwt_required()
def update_tip(id):
    tip = Tip.query.get_or_404(id)
    data = request.get_json()
    tip.content = data['content']
    db.session.commit()
    return jsonify({'message': 'Tip updated successfully'}), 200

@community_bp.route('/tips/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_tip(id):
    tip = Tip.query.get_or_404(id)
    db.session.delete(tip)
    db.session.commit()
    return jsonify({'message': 'Tip deleted successfully'}), 200

@community_bp.route('/forum', methods=['POST'])
@jwt_required()
def add_forum_post():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_post = ForumPost(title=data['title'], content=data['content'], user_id=user_id)
    db.session.add(new_post)
    db.session.commit()
    return jsonify({'message': 'Forum post added successfully'}), 201

@community_bp.route('/forum', methods=['GET'])
@jwt_required()
def get_forum_posts():
    posts = ForumPost
