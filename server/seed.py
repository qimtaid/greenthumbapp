from app import app, db
from models import User, Plant, CareSchedule, Tip, Layout
from datetime import datetime
import json

def seed_database():
    # The entire seed process is wrapped in the application context
    with app.app_context():
        # Create all tables if they don't exist
        db.create_all()

        # Sample users data
        user_data = [
            {'username': 'Riko-04', 'email': 'echoge11@gmail.com', 'password': 'Kiptoosky@04'},
            {'username': 'testuser', 'email': 'testuser@gmail.com', 'password': 'password123'}
        ]

        for user_info in user_data:
            user = User.query.filter_by(username=user_info['username']).first()
            if not user:
                user = User(username=user_info['username'], email=user_info['email'])
                user.set_password(user_info['password'])
                db.session.add(user)
        db.session.commit()

        # Sample plants data with images
        plant_data = [
            {
                'name': 'Tomato',
                'img_url': 'https://plus.unsplash.com/premium_photo-1669906333449-5fc2c47cd8ec?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                'description': 'A red, juicy fruit often used in salads and cooking.',
                'user': 'Riko-04'
            },
            {
                'name': 'Basil',
                'img_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwl3tBPY4s-7hS8sRWGPQgeJ1DX0vBhDpMug&usqp=CAU',
                'description': 'A fragrant herb commonly used in Italian cuisine.',
                'user': 'testuser'
            }
        ]

        for plant_info in plant_data:
            user = User.query.filter_by(username=plant_info['user']).first()
            if user:
                plant = Plant.query.filter_by(name=plant_info['name'], user_id=user.id).first()
                if not plant:
                    plant = Plant(
                        name=plant_info['name'],
                        img_url=plant_info['img_url'],
                        description=plant_info['description'],
                        user_id=user.id
                    )
                    db.session.add(plant)
        db.session.commit()

        # Sample care schedules
        care_schedules = [
            {'plant_name': 'Tomato', 'task': 'Watering', 'schedule_date': datetime(2024, 8, 1), 'interval': 'Daily', 'user': 'Riko-04'},
            {'plant_name': 'Basil', 'task': 'Pruning', 'schedule_date': datetime(2024, 8, 2), 'interval': 'Fortnightly', 'user': 'testuser'}
        ]

        for schedule_info in care_schedules:
            plant = Plant.query.filter_by(name=schedule_info['plant_name']).first()
            user = User.query.filter_by(username=schedule_info['user']).first() if plant else None
            if plant and user:
                schedule = CareSchedule.query.filter_by(plant_id=plant.id, task=schedule_info['task']).first()
                if not schedule:
                    schedule = CareSchedule(
                        plant_id=plant.id,
                        task=schedule_info['task'],
                        schedule_date=schedule_info['schedule_date'],
                        interval=schedule_info['interval'],
                        user_id=user.id
                    )
                    db.session.add(schedule)
        db.session.commit()

        # Sample tips data
        tip_data = [
            {'title': 'Watering Tips', 'content': 'Water your plants regularly.', 'author': 'Riko-04'},
            {'title': 'Pruning Tips', 'content': 'Prune your plants to promote growth.', 'author': 'testuser'}
        ]

        for tip_info in tip_data:
            user = User.query.filter_by(username=tip_info['author']).first()
            if user:
                tip = Tip.query.filter_by(title=tip_info['title'], user_id=user.id).first()
                if not tip:
                    tip = Tip(
                        title=tip_info['title'],
                        content=tip_info['content'],
                        user_id=user.id
                    )
                    db.session.add(tip)
        db.session.commit()

        """ # Sample forum posts
        post_data = [
            {'title': 'Help with tomatoes', 'content': 'My tomatoes are not growing well.', 'author': 'Riko-04'},
            {'title': 'Basil care', 'content': 'How do I take care of basil?', 'author': 'testuser'}
        ]

        for post_info in post_data:
            user = User.query.filter_by(username=post_info['author']).first()
            if user:
                post = ForumPost.query.filter_by(title=post_info['title'], author_id=user.id).first()
                if not post:
                    post = ForumPost(
                        title=post_info['title'],
                        content=post_info['content'],
                        author_id=user.id
                    )
                    db.session.add(post)
        db.session.commit() """

        # Seed data for garden layouts
        layout_data = [
            {
                'name': 'My Vegetable Garden',
                'user': 'Riko-04',
                'layout_data': [
                    {
                        'plant_id': 1,
                        'name': 'Tomato',
                        'img_url': 'https://plus.unsplash.com/premium_photo-1669906333449-5fc2c47cd8ec?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                        'position': {'x': 0, 'y': 1}
                    }
                ],
                'created_at': datetime(2024, 9, 18),
                'updated_at': datetime(2024, 10, 18)
            },
            {
                'name': 'Herb Garden',
                'user': 'testuser',
                'layout_data': [
                    {
                        'plant_id': 2,
                        'name': 'Basil',
                        'img_url': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRwl3tBPY4s-7hS8sRWGPQgeJ1DX0vBhDpMug&usqp=CAU',
                        'position': {'x': 0, 'y': 1}
                    }
                ],
                'created_at': datetime(2024, 9, 18),
                'updated_at': datetime(2024, 10, 18)
            }
        ]

        # Adding the seed data to the database
        for layout_info in layout_data:
            user = User.query.filter_by(username=layout_info['user']).first()
            if user:
                layout = Layout.query.filter_by(name=layout_info['name'], user_id=user.id).first()
                if not layout:
                    layout = Layout(
                        name=layout_info['name'],
                        layout_data=json.dumps(layout_info['layout_data']),  # Convert layout_data to JSON string here
                        user_id=user.id,
                        created_at=layout_info['created_at'],
                        updated_at=layout_info['updated_at']
                    )
                    db.session.add(layout)

        db.session.commit()


    print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
