from app import app, db
from models import User, Plant, CareSchedule, Tip, ForumPost, GardenLayout
from datetime import datetime

with app.app_context():
    db.create_all()

    # Create sample users
    user1 = User(username='gardener1', email='gardener1@example.com')
    user1.set_password('password1')
    user2 = User(username='gardener2', email='gardener2@example.com')
    user2.set_password('password2')

    db.session.add(user1)
    db.session.add(user2)
    db.session.commit()

    # Create sample plants
    plant1 = Plant(name='Tomato', user_id=user1.id)
    plant2 = Plant(name='Basil', user_id=user2.id)

    db.session.add(plant1)
    db.session.add(plant2)
    db.session.commit()

    # Create sample care schedules
    schedule1 = CareSchedule(plant_id=plant1.id, task='Watering', schedule_date=datetime(2024, 8, 1))
    schedule2 = CareSchedule(plant_id=plant2.id, task='Pruning', schedule_date=datetime(2024, 8, 2))

    db.session.add(schedule1)
    db.session.add(schedule2)
    db.session.commit()

    # Create sample tips
    tip1 = Tip(title='Watering Tips', content='Water your plants regularly.', author_id=user1.id)
    tip2 = Tip(title='Pruning Tips', content='Prune your plants to promote growth.', author_id=user2.id)

    db.session.add(tip1)
    db.session.add(tip2)
    db.session.commit()

    # Create sample forum posts
    post1 = ForumPost(title='Help with tomatoes', content='My tomatoes are not growing well.', author_id=user1.id)
    post2 = ForumPost(title='Basil care', content='How do I take care of basil?', author_id=user2.id)

    db.session.add(post1)
    db.session.add(post2)
    db.session.commit()

    # Create sample garden layouts
    layout1 = GardenLayout(name='My Vegetable Garden', user_id=user1.id, layout_data='{"beds": [{"name": "Bed 1", "plants": ["Tomato", "Basil"]}] }')
    layout2 = GardenLayout(name='Herb Garden', user_id=user2.id, layout_data='{"beds": [{"name": "Bed 1", "plants": ["Basil"]}] }')

    db.session.add(layout1)
    db.session.add(layout2)
    db.session.commit()

    print("Database seeded successfully!")
