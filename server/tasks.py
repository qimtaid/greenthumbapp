from flask_mail import Mail, Message
from sqlalchemy.orm import sessionmaker
from app import app, db
from models import CareSchedule, User

mail = Mail(app)

def check_due_schedules():
    with app.app_context():  # Ensure the application context is active
        Session = sessionmaker(bind=db.engine)
        session = Session()

        schedules = CareSchedule.query.all()
        for schedule in schedules:
            user = session.get(User, schedule.plant.user_id)
            if user and schedule.is_due():
                send_notification(user.email, schedule)

def send_notification(email, schedule):
    msg = Message("Care Schedule Due",
                  sender="testuser@gmail.com",
                  recipients=[email])
    msg.body = f"Your care schedule for plant {schedule.plant.name} is due."
    try:
        with app.app_context():  # Ensure the application context is active
            mail.send(msg)
    except Exception as e:
        print(f"Failed to send email: {e}")

if __name__ == "__main__":
    check_due_schedules()
