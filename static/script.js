// Execute this when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    showLogin(); // Default to the Login page
});

// Show the Login Form
function showLogin() {
    console.log("Navigating to Login form...");
    document.getElementById("loginForm").style.display = "block"; // Show login form
    document.getElementById("userDashboard").style.display = "none"; // Hide dashboard
    document.getElementById("forgotPasswordForm").style.display = "none"; // Hide forgot password form
    document.getElementById("signUpForm").style.display = "none"; // Hide sign-up form
    document.getElementById("welcomeMessage").textContent = ""; // Reset welcome message
}

// Handle Login Button Click
function loginUser() {
    console.log("Login button clicked!");

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Login failed. Check your credentials.");
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("Login successful!");
            document.getElementById("loginForm").style.display = "none"; // Hide login form
            document.getElementById("userDashboard").style.display = "block"; // Show dashboard
            document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`; // Display welcome message
        } else {
            alert(data.message || "Login failed!");
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
        alert("Login failed. Please try again.");
    });
}

// Handle Sign-Up Button Click
function signUpUser() {
    console.log("Sign-Up button clicked!");

    const username = document.getElementById("signupUsername").value.trim();
    const password = document.getElementById("signupPassword").value.trim();

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Sign-Up failed.");
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log("User registered successfully!");
            alert(data.message || "User registered successfully!");
            showLogin(); // Redirect to login after sign-up
        } else {
            alert(data.message || "Sign-Up failed!");
        }
    })
    .catch(error => {
        console.error("Error during sign-up:", error);
        alert("Unable to register. Please try again later.");
    });
}

// Handle Submit Metrics Button Click
function submitMetrics() {
    console.log("Submit Metrics button clicked!");

    const heartRate = parseInt(document.getElementById("heartRate").value.trim());
    const temperature = parseFloat(document.getElementById("temperature").value.trim());
    const steps = parseInt(document.getElementById("steps").value.trim());

    if (!heartRate || !temperature || !steps) {
        alert("Please fill in all fields.");
        return;
    }

    const username = document.getElementById("welcomeMessage").textContent.replace("Welcome, ", "").replace("!", "");

    fetch('/submit_metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, metrics: { heart_rate: heartRate, temperature, steps } })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Clear previous feedback
            const dashboard = document.getElementById("userDashboard");
            const existingFeedback = document.querySelector("#userFeedback");
            if (existingFeedback) {
                existingFeedback.remove();
            }

            // Determine health status
            const healthStatus = determineHealthStatus(heartRate, temperature, steps);

            // Display new feedback
            const responseDiv = document.createElement("div");
            responseDiv.id = "userFeedback"; // Unique ID for feedback section
            responseDiv.textContent = `Hello ${username}, ${healthStatus}`;
            responseDiv.style.marginTop = "20px";
            responseDiv.style.padding = "10px";
            responseDiv.style.border = "1px solid #007BFF";
            responseDiv.style.borderRadius = "5px";
            responseDiv.style.backgroundColor = "#EAF4FC";
            responseDiv.style.color = "#007BFF";

            dashboard.appendChild(responseDiv);
        } else {
            alert(data.message || "Metrics submission failed.");
        }
    })
    .catch(error => {
        console.error("Error during metrics submission:", error);
        alert("Metrics submission failed. Please try again.");
    });
}
// Handle Forgot Password Navigation
function showForgotPassword() {
    console.log("Navigating to Forgot Password form...");
    document.getElementById("loginForm").style.display = "none"; // Hide login form
    document.getElementById("forgotPasswordForm").style.display = "block"; // Show forgot password form
    document.getElementById("signUpForm").style.display = "none"; // Hide sign-up form
    document.getElementById("userDashboard").style.display = "none"; // Hide dashboard
}

// Handle Sign-Up Navigation
function showSignUp() {
    console.log("Navigating to Sign-Up form...");
    document.getElementById("loginForm").style.display = "none"; // Hide login form
    document.getElementById("forgotPasswordForm").style.display = "none"; // Hide forgot password form
    document.getElementById("signUpForm").style.display = "block"; // Show sign-up form
    document.getElementById("userDashboard").style.display = "none"; // Hide dashboard
}

// Go Back to Login Form
function goBack() {
    console.log("Back button clicked!");
    showLogin(); // Navigate back to the login form
}

// Handle Logout Button Click
function logout() {
    console.log("Logout button clicked!");
    alert("You have been logged out.");
    showLogin(); // Redirect to the login page
}
function determineHealthStatus(heartRate, temperature, steps) {
    let statusMessage = "";

    // Heart Rate Feedback
    if (heartRate < 60) {
        statusMessage += "Your heart rate is low. Consider consulting a healthcare provider. ";
    } else if (heartRate > 100) {
        statusMessage += "Your heart rate is elevated. You might want to rest or check your activity levels. ";
    } else {
        statusMessage += "Your heart rate is normal. Great job! ";
    }

    // Temperature Feedback
    if (temperature < 36) {
        statusMessage += "Your body temperature is low. Stay warm and monitor for symptoms of hypothermia. ";
    } else if (temperature > 37.2) {
        statusMessage += "You have a fever. Rest and consider seeking medical advice. ";
    } else {
        statusMessage += "Your body temperature is normal. Keep it steady! ";
    }

    // Steps Feedback
    if (steps < 5000) {
        statusMessage += "Your activity level is sedentary. Aim for more physical activity during the day. ";
    } else if (steps > 10000) {
        statusMessage += "Excellent! You’re maintaining an active lifestyle. Keep it up!";
    } else {
        statusMessage += "You’re moderately active. Good work—try to push a little more for optimal health!";
    }

    return statusMessage;
}