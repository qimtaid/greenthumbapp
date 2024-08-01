from flask import Blueprint, request, jsonify
from models import db, CareSchedule
from flask_jwt_extended import jwt_required

care_schedule_bp = Blueprint('care_schedule', __name__)

@care_schedule_bp.route('/plants/<int:plant_id>/schedule', methods=['POST'])
@jwt_required()
def add_care_schedule(plant_id):
    data = request.get_json()
    new_schedule = CareSchedule(task=data['task'], frequency=data['frequency'], plant_id=plant_id)
    db.session.add(new_schedule)
    db.session.commit()
    return jsonify({'message': 'Care schedule added successfully'}), 201

@care_schedule_bp.route('/plants/<int:plant_id>/schedule', methods=['GET'])
@jwt_required()
def get_care_schedules(plant_id):
    schedules = CareSchedule.query.filter_by(plant_id=plant_id).all()
    return jsonify([schedule.as_dict() for schedule in schedules]), 200

app.register_blueprint(care_schedule_bp)
