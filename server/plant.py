from flask import Blueprint, request, jsonify
from models import db, Plant
from flask_jwt_extended import jwt_required, get_jwt_identity

plant_bp = Blueprint('plant', __name__)

@plant_bp.route('/plants', methods=['POST'])
@jwt_required()
def add_plant():
    user_id = get_jwt_identity()
    data = request.get_json()
    new_plant = Plant(name=data['name'], description=data['description'], user_id=user_id)
    db.session.add(new_plant)
    db.session.commit()
    return jsonify({'message': 'Plant added successfully'}), 201

@plant_bp.route('/plants', methods=['GET'])
@jwt_required()
def get_plants():
    user_id = get_jwt_identity()
    plants = Plant.query.filter_by(user_id=user_id).all()
    return jsonify([plant.as_dict() for plant in plants]), 200

@plant_bp.route('/plants/<int:id>', methods=['GET'])
@jwt_required()
def get_plant(id):
    plant = Plant.query.get_or_404(id)
    return jsonify(plant.as_dict()), 200

@plant_bp.route('/plants/<int:id>', methods=['PUT'])
@jwt_required()
def update_plant(id):
    plant = Plant.query.get_or_404(id)
    data = request.get_json()
    plant.name = data['name']
    plant.description = data['description']
    db.session.commit()
    return jsonify({'message': 'Plant updated successfully'}), 200

@plant_bp.route('/plants/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_plant(id):
    plant = Plant.query.get_or_404(id)
    db.session.delete(plant)
    db.session.commit()
    return jsonify({'message': 'Plant deleted successfully'}), 200

app.register_blueprint(plant_bp)

