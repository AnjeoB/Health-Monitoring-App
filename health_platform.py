import tkinter as tk
from tkinter import messagebox
import requests

# Initialize the main app window
app = tk.Tk()
app.title("Health Monitoring Platform")
app.geometry("400x500")  # Set the window size

# Add a welcoming header
welcome_label = tk.Label(app, text="Welcome to the Health Monitoring Platform!", font=("Arial", 16), fg="blue")
welcome_label.pack(pady=20)

# Input fields for health metrics
tk.Label(app, text="Enter your Heart Rate:", font=("Arial", 12)).pack()
heart_rate_entry = tk.Entry(app)
heart_rate_entry.pack()

tk.Label(app, text="Enter your Body Temperature (°C):", font=("Arial", 12)).pack()
temperature_entry = tk.Entry(app)
temperature_entry.pack()

tk.Label(app, text="Enter your Steps:", font=("Arial", 12)).pack()
steps_entry = tk.Entry(app)
steps_entry.pack()

# Submit button function
def submit_metrics():
    try:
        # Get input data
        heart_rate = int(heart_rate_entry.get())
        temperature = float(temperature_entry.get())
        steps = int(steps_entry.get())

        # Prepare data for the backend
        data = {
            "username": "Bill",  # Replace with dynamic user input if desired
            "metrics": {
                "heart_rate": heart_rate,
                "temperature": temperature,
                "steps": steps
            }
        }

        # Send data to the backend
        response = requests.post("http://127.0.0.1:5000/submit_metrics", json=data)

        # Display feedback based on response
        if response.status_code == 200:
            feedback_label.config(text=response.json().get("message", "Metrics submitted successfully!"))
        else:
            feedback_label.config(text="Error: " + response.json().get("message", "Something went wrong."))
    except ValueError:
        messagebox.showerror("Input Error", "Please enter valid numbers for all metrics.")
    except Exception as e:
        messagebox.showerror("Connection Error", f"Failed to connect to the backend: {str(e)}")

submit_button = tk.Button(app, text="Submit Metrics", command=submit_metrics, bg="green", fg="white", font=("Arial", 12))
submit_button.pack(pady=20)

# Feedback section
feedback_label = tk.Label(app, text="", font=("Arial", 12), justify="left", wraplength=350)
feedback_label.pack(pady=20)

# Run the app
app.mainloop()