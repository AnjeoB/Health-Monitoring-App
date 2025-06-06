# Health Monitoring App
# Health Monitoring Platform

The **Health Monitoring Platform** is a responsive web application designed to promote healthier lifestyles by enabling users to monitor essential health metrics, including heart rate, body temperature, and daily step count. The platform is intuitive, user-friendly, and helps users take proactive measures toward maintaining their health and wellness.

---

## **Features**
### **User Authentication**
- Secure Login and Sign-Up functionality to protect user data and prevent unauthorized access.
- Personalized Dashboard displaying a welcome message with the user's name upon successful login.

### **Health Metrics Input**
- **Heart Rate**: Users can log their heart rate (BPM).
- **Body Temperature**: Track body temperature in °C with precise input fields.
- **Step Count**: Input daily steps to track physical activity.

### **Interactive UI**
- Simple and intuitive interface for easy navigation between Login, Sign-Up, and Forgot Password functionalities.
- Seamless transitions between pages, ensuring a smooth user experience.

### **Error Handling**
- Alerts users for incorrect inputs or incomplete fields.
- Provides feedback for failed login or sign-up attempts.

### **Additional Functionalities**
- **Forgot Password**: Reset user credentials securely.
- **Logout Button**: Allows users to securely end their session and return to the Login page.
- **Back Button**: Navigates users back to the Login form from the Dashboard.

---

## **Technologies Used**
### **Frontend**
- **HTML**: Structuring the application’s interface.
- **CSS**: Styling the platform for a clean, modern design.
- **JavaScript**: Adding interactivity and handling client-side logic.

### **Backend**
- **Flask (Python)**: Handling server-side logic and API endpoints.
- **In-Memory Database**: Storing user credentials and health metrics for simplicity (can be extended to a robust database solution).

### **Version Control**
- **Git & GitHub**: Used for version control and collaboration.

---

## **Installation Guide**
Follow these steps to set up the project locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/AnjeoB/Health-Monitoring-App.git
   cd Health-Monitoring-App
2. - Set Up the Backend-
 -Ensure Python and Flask are installed on your system.
 - Run the Flask server:python app.py


3 - Access the Frontend- 
-Open index.html in your browser to access the application.

How to Use
- Login or Sign-Up:- Use the Login page to log in or create a new account via the Sign-Up form.

- Forgot Password:- If you forget your credentials, use the "Forgot Password" link to reset them.

- Input Metrics:- After logging in, enter your heart rate, body temperature, and daily steps in the Dashboard.

- Submit Metrics:- Once metrics are entered, click "Submit" to save the data.
Folder Structure
├── app.py                # Backend server with Flask
├── static/
│   ├── script.js         # JavaScript for client-side functionality
│   ├── style.css         # CSS for UI styling
├── templates/
│   ├── index.html        # Main HTML file
├── README.md             # Project documentation

Future Enhancements
Here’s what’s next for the platform:
- Metrics Visualization:- Implement graphical representations (charts/graphs) to display health trends over time.

- Database Integration:- Transition from an in-memory database to a robust SQL or NoSQL database for scalable data storage.

- Notifications:- Send users reminders and health tips via email.

- Mobile Optimization:- Fully optimize the platform for mobile and tablet users.

Contributing
We welcome contributions to this project! Here’s how you can get involved:
- Fork the repository on GitHub.
- Create a new branch:git checkout -b feature-name

- Make your changes and commit them:git commit -m "Description of changes"

- Push the branch to your fork:git push origin feature-name

- Submit a pull request explaining the changes.



License
This project is licensed under the MIT License. Feel free to use, modify, and distribute this project in accordance with the license terms.


Acknowledgments
Special thanks to:
- Everyone who has supported and contributed to this project.
- The developers who make open-source tools and libraries possible.



Contact
For inquiries, please contact:
- Developer: Bill Anjeo
- Email: billanjeo03@gmail.com
- GitHub: GitHub Profile EOL


---








