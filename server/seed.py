from app import app, db
from models import User, Plant, CareSchedule, Tips, ForumPost, Comment, GardenLayout, ScheduleInterval, CareType
from datetime import datetime

def seed_database():
    with app.app_context():
        # Drop all tables and recreate them to ensure schema consistency
        db.drop_all()
        db.create_all()

        # Create sample users
        user_data = [
            {'username': 'Riko-04', 'email': 'echoge11@gmail.com', 'password': 'Kiptoosky@04'},
            {'username': 'testuser', 'email': 'testuser@gmail.com', 'password': 'password123'},
            {'username': 'Dan', 'email': 'dan@moringa.com', 'password': 'SE2024'}
        ]
        users = {}
        
        for user_info in user_data:
            user = User.query.filter_by(username=user_info['username']).first()
            if not user:
                user = User(username=user_info['username'], email=user_info['email'])
                user.set_password(user_info['password'])
                db.session.add(user)
                users[user_info['username']] = user
            else:
                users[user_info['username']] = user
        
        db.session.commit()

        # Create sample plants with img_url
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
            user = users[plant_info['user']]
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

        # Create sample care schedules
        care_schedules = [
            {'plant_name': 'Tomato', 'task': 'WATERING', 'schedule_date': datetime(2024, 8, 1), 'interval': 'DAILY'},
            {'plant_name': 'Basil', 'task': 'PRUNING', 'schedule_date': datetime(2024, 8, 2), 'interval': 'WEEKLY'}
        ]

        for schedule_info in care_schedules:
            plant = Plant.query.filter_by(name=schedule_info['plant_name']).first()
            if plant:
                schedule = CareSchedule.query.filter_by(
                    plant_id=plant.id,
                    task=CareType[schedule_info['task']]
                ).first()
                if not schedule:
                    schedule = CareSchedule(
                        plant_id=plant.id,
                        task=CareType[schedule_info['task']],
                        schedule_date=schedule_info['schedule_date'],
                        interval=ScheduleInterval[schedule_info['interval']]
                    )
                    db.session.add(schedule)

        db.session.commit()

        # Create sample tips
        tips_data = [
            {'title': 'Watering Tips', 'content': 'Water your plants regularly.', 'author': 'Riko-04'},
            {'title': 'Pruning Tips', 'content': 'Prune your plants to promote growth.', 'author': 'testuser'}
        ]

        for tips_info in tips_data:
            user = users[tips_info['author']]
            if user:
                tip = Tips.query.filter_by(title=tips_info['title'], author_id=user.id).first()
                if not tip:
                    tip = Tips(
                        title=tips_info['title'],
                        content=tips_info['content'],
                        author_id=user.id
                    )
                    db.session.add(tip)

        db.session.commit()

        # Create sample forum posts
        post_data = [
            {'title': 'Help with tomatoes', 'content': 'My tomatoes are not growing well.', 'author': 'Riko-04'},
            {'title': 'Basil care', 'content': 'How do I take care of basil?', 'author': 'testuser'}
        ]

        for post_info in post_data:
            user = users[post_info['author']]
            if user:
                post = ForumPost.query.filter_by(title=post_info['title'], author_id=user.id).first()
                if not post:
                    post = ForumPost(
                        title=post_info['title'],
                        content=post_info['content'],
                        author_id=user.id
                    )
                    db.session.add(post)

        db.session.commit()

        # Create sample comments
        comment_data = [
            {'post_title': 'Help with tomatoes', 'content': 'Try adjusting the soil pH.', 'author': 'testuser'},
            {'post_title': 'Basil care', 'content': 'Make sure it gets plenty of sunlight.', 'author': 'Riko-04'}
        ]

        for comment_info in comment_data:
            user = users[comment_info['author']]
            post = ForumPost.query.filter_by(title=comment_info['post_title']).first()
            if user and post:
                comment = Comment.query.filter_by(content=comment_info['content'], post_id=post.id, author_id=user.id).first()
                if not comment:
                    comment = Comment(
                        content=comment_info['content'],
                        post_id=post.id,
                        author_id=user.id
                    )
                    db.session.add(comment)

        db.session.commit()

        # Create sample garden layouts
        layout_data = [
            {'name': 'My Vegetable Garden', 'user': 'Riko-04', 'layout_data': '{"beds": [{"name": "Bed 1", "plants": ["Tomato", "Basil"]}]}'},
            {'name': 'Herb Garden', 'user': 'testuser', 'layout_data': '{"beds": [{"name": "Bed 1", "plants": ["Basil"]}]}'}
        ]

        for layout_info in layout_data:
            user = users[layout_info['user']]
            if user:
                layout = GardenLayout.query.filter_by(name=layout_info['name'], user_id=user.id).first()
                if not layout:
                    layout = GardenLayout(
                        name=layout_info['name'],
                        user_id=user.id,
                        layout_data=layout_info['layout_data']
                    )
                    db.session.add(layout)

        db.session.commit()

        print("Database seeded successfully!")

if __name__ == '__main__':
    seed_database()
