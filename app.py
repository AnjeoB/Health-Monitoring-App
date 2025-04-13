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
    try:
        # Parse incoming data
        data = request.json
        username = data.get("username")
        metrics = data.get("metrics")

        # Validate required fields
        if not username or not metrics or not metrics.get("heart_rate") or not metrics.get("temperature") or not metrics.get("steps"):
            return jsonify({"success": False, "message": "Missing required data"}), 400

        # Validate values
        heart_rate = int(metrics["heart_rate"])
        temperature = float(metrics["temperature"])
        steps = int(metrics["steps"])

        if heart_rate < 0 or steps < 0 or temperature <= 0:
            return jsonify({"success": False, "message": "Invalid metric values"}), 400

        # Perform necessary actions (e.g., save to database)
        print(f"Received metrics for {username}: {metrics}")
        return jsonify({"success": True, "message": "Metrics submitted successfully!"}), 200

    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"success": False, "message": "Server error occurred"}), 500
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