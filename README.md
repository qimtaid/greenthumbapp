Sure, here's the updated README file without the clone instructions.

### README.md

```markdown
# GreenThumb App

GreenThumb is a web application designed to help gardeners manage plant care, track gardening tasks, and share gardening tips and knowledge. The application consists of a React frontend and a Flask backend, with a PostgreSQL database for data storage.

## Features

### Frontend (React)
- **User Registration and Authentication:**
  - Registration and Login Forms
  - Client-side Validation
  - Integration with Backend API
- **Plant Care Tracker:**
  - Track Plants: Add and manage plants in the garden
  - Care Schedule: Schedule and track plant care tasks (watering, fertilizing, etc.)
- **Gardening Tips and Community:**
  - Tips and Articles: Library of gardening tips and articles
  - Community Forum: Share tips and ask questions
- **Garden Layout Planner:**
  - Design Garden Layouts: Tools for designing and planning garden layouts
  - Plant Placement: Interface for placing plants in the garden layout

### Backend (Flask)
- **User Management:**
  - API endpoints for user registration, login, and authentication
  - JWT authentication for securing endpoints and validating user sessions
- **Database Integration:**
  - PostgreSQL for data storage
  - SQLAlchemy ORM for database interaction
- **Plant Management API:**
  - CRUD Operations for managing plants
  - Endpoints for managing and retrieving care schedules
- **Gardening Tips and Community:**
  - CRUD Operations for managing gardening tips and articles
  - Endpoints for managing community forum posts
- **Garden Layout:**
  - CRUD Operations for garden layouts
  - Endpoints for managing plant placement in layouts
- **Logging and Monitoring:**
  - Logging of critical events and monitoring of system health

## Project Structure

```plaintext
GreenThumb/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── seed.py
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── App.js
    │   ├── index.js
    │   └── ...
    └── package.json
```

## Getting Started

### Backend

1. **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2. **Set up the virtual environment and install dependencies:**
    ```sh
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    ```

3. **Set up the PostgreSQL database:**
    - Update the database URI in `app.py` to match your PostgreSQL credentials.

4. **Run database migrations:**
    ```sh
    flask db init
    flask db migrate
    flask db upgrade
    ```

5. **Seed the database:**
    ```sh
    python seed.py
    ```

6. **Run the Flask server:**
    ```sh
    flask run
    ```

### Frontend

1. **Navigate to the frontend directory:**
    ```sh
    cd frontend
    ```

2. **Install dependencies:**
    ```sh
    npm install
    ```

3. **Start the React development server:**
    ```sh
    npm start
    ```

## API Endpoints

### User Management
- **POST /register:** Register a new user
- **POST /login:** Login a user and return a JWT token

### Plant Management
- **POST /plants:** Add a new plant
- **GET /plants:** Get all plants for the authenticated user

### Care Schedule Management
- **POST /plants/<int:plant_id>/schedule:** Add a care schedule for a plant
- **GET /plants/<int:plant_id>/schedule:** Get care schedules for a plant

### Gardening Tips
- **POST /tips:** Add a new gardening tip
- **GET /tips:** Get all gardening tips

### Forum Management
- **POST /forum:** Add a new forum post
- **GET /forum:** Get all forum posts

### Garden Layout Management
- **POST /layouts:** Add a new garden layout
- **GET /layouts:** Get all garden layouts for the authenticated user

## Contributors
Eric Choge
Dorcas Akamuran
Dan Koskei



## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
