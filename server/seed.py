from app import app, db
from models import User, Plant, CareSchedule, Tip, ForumPost, GardenLayout
from datetime import datetime

def create_sample_data():
    with app.app_context():
        # Drop all tables and recreate them (only for development purposes)
        db.drop_all()
        db.create_all()

        # Create users with unique emails
        user1 = User(username='Akamuran', email='doroakamu@gmail.com')
        user1.set_password('password1')
        user2 = User(username='Eric ', email='choge@12.com')  # Unique email for user2
        user2.set_password('Greenthumb2')

        db.session.add(user1)
        db.session.add(user2)

        # Create plants
        plant1 = Plant(name='Watermelon', user_id=user1.id)
        plant2 = Plant(name='Mint', user_id=user1.id)
        plant3 = Plant(name='Lily', user_id=user2.id)

        db.session.add(plant1)
        db.session.add(plant2)
        db.session.add(plant3)

        # Create care schedules
        schedule1 = CareSchedule(task='Watering', schedule_date=datetime.utcnow(), plant=plant1)
        schedule2 = CareSchedule(task='Mint', schedule_date=datetime.utcnow(), plant=plant2)
        schedule3 = CareSchedule(task='Lily', schedule_date=datetime.utcnow(), plant=plant3)

        db.session.add(schedule1)
        db.session.add(schedule2)
        db.session.add(schedule3)

        # Create tips
        tip1 = Tip(title='Morning Watering', content='Water your plants early in the morning.', author_id=user1.id)
        tip2 = Tip(title='Use Compost', content='Use compost for better growth.', author_id=user2.id)

        db.session.add(tip1)
        db.session.add(tip2)

        # Create forum posts
        post1 = ForumPost(title='How to grow watermelon?', content='Any tips for growing watermelon?', author_id=user1.id)
        post2 = ForumPost(title='Best fertilizer for lily?', content='What is the best fertilizer for lilies?', author_id=user2.id)

        db.session.add(post1)
        db.session.add(post2)

        # Create garden layouts
        layout1 = GardenLayout(name='Vegetable Garden', layout_data='Layout data for vegetable garden', user_id=user1.id)
        layout2 = GardenLayout(name='Flower Garden', layout_data='Layout data for flower garden', user_id=user2.id)

        db.session.add(layout1)
        db.session.add(layout2)

        # Commit changes
        db.session.commit()
        print("Sample data created successfully!")

if __name__ == '__main__':
    create_sample_data()
