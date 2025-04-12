from flask import Flask, render_template, request, jsonify
import sqlite3
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask application
app = Flask(__name__)

# --- DATABASE INITIALIZATION ---
# Function to create database tables
def initialize_database():
    conn = sqlite3.connect("health.db")
    cursor = conn.cursor()

    # Create 'users' table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
    """)

    # Create 'metrics' table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS metrics (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        heart_rate INTEGER NOT NULL,
        temperature REAL NOT NULL,
        steps INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    """)

    conn.commit()
    conn.close()

# Initialize the database on app start
initialize_database()

# --- ROUTES ---

# Home route: Renders the main dashboard
@app.route('/')
def home():
    return render_template('index.html')  # Ensure 'index.html' exists in the templates folder

# User registration endpoint
@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data['username']
    password = data['password']  # Password sent from the frontend

    try:
        conn = sqlite3.connect("health.db")
        cursor = conn.cursor()

        # Hash the password before storing
        hashed_password = generate_password_hash(password)
        cursor.execute("INSERT INTO users (username, password) VALUES (?, ?)", (username, hashed_password))

        conn.commit()
        conn.close()
        return jsonify({"message": "User registered successfully!"}), 201
    except sqlite3.IntegrityError:
        return jsonify({"message": "User already exists!"}), 400

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    try:
        conn = sqlite3.connect("health.db")
        cursor = conn.cursor()

        # Fetch the stored hashed password for the user
        cursor.execute("SELECT password FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        conn.close()

        if user and check_password_hash(user[0], password):
            return jsonify({"success": True, "message": "Login successful!"}), 200
        else:
            return jsonify({"success": False, "message": "Invalid username or password."}), 401
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

# Submit health metrics endpoint
@app.route('/submit_metrics', methods=['POST'])
def submit_metrics():
    data = request.json
    username = data['username']
    metrics = data.get('metrics', {})

    try:
        conn = sqlite3.connect("health.db")
        cursor = conn.cursor()

        # Retrieve user ID
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"message": "User not found!"}), 404

        user_id = user[0]

        # Insert metrics into the database
        cursor.execute("""
        INSERT INTO metrics (user_id, heart_rate, temperature, steps)
        VALUES (?, ?, ?, ?)
        """, (user_id, metrics['heart_rate'], metrics['temperature'], metrics['steps']))
        conn.commit()
        conn.close()

        # Analyze metrics for health status
        heart_rate = metrics['heart_rate']
        temperature = metrics['temperature']
        steps = metrics['steps']

        status = []
        if heart_rate < 60 or heart_rate > 100:
            status.append("Abnormal heart rate")
        if temperature < 36.1 or temperature > 37.2:
            status.append("Abnormal body temperature")
        if steps < 5000:
            status.append("Low activity levels")

        status_message = "All metrics are normal" if not status else "; ".join(status)
        return jsonify({"message": "Metrics submitted successfully!", "status": status_message}), 200
    except Exception as e:
        return jsonify({"message": f"Error: {str(e)}"}), 500

# Password reset endpoint
@app.route('/reset_password', methods=['POST'])
def reset_password():
    data = request.json
    username = data['username']
    new_password = data['newPassword']

    try:
        conn = sqlite3.connect("health.db")
        cursor = conn.cursor()

        # Check if the user exists
        cursor.execute("SELECT id FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({"success": False, "message": "User not found!"}), 404

        # Hash the new password
        hashed_password = generate_password_hash(new_password)

        # Update the user's password
        cursor.execute("UPDATE users SET password = ? WHERE username = ?", (hashed_password, username))
        conn.commit()
        conn.close()

        return jsonify({"success": True, "message": "Password reset successfully!"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": f"Error: {str(e)}"}), 500

# --- RUN FLASK APP ---
if __name__ == '__main__':
    app.run(debug=True)