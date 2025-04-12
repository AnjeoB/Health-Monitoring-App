document.addEventListener("DOMContentLoaded", () => {
    showLogin(); // Default to the Login page
});

// Show the Login Form
function showLogin() {
    console.log("Navigating to Login form...");
    document.getElementById("loginForm").style.display = "block";
    document.getElementById("userDashboard").style.display = "none"; // Hide dashboard
    document.getElementById("welcomeMessage").textContent = ""; // Reset welcome message
}

// Handle Login Button Click
function loginUser() {
    console.log("Login button clicked!");

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please enter your username and password.");
        return;
    }

    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("Login successful!");
            document.getElementById("loginForm").style.display = "none"; // Hide Login form
            document.getElementById("userDashboard").style.display = "block"; // Show dashboard

            // Display welcome message with user's name
            document.getElementById("welcomeMessage").textContent = `Welcome, ${username}!`;
        } else {
            alert(data.message || "Login failed!");
        }
    })
    .catch(error => {
        console.error("Error during login:", error);
    });
}
// Show the Forgot Password Form
function showForgotPassword() {
    console.log("Navigating to Forgot Password form...");
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("forgotPasswordForm").classList.add("active");
    document.getElementById("signUpForm").classList.remove("active");
    document.getElementById("userDashboard").classList.remove("active");
}

// Show the Sign-Up Form
function showSignUp() {
    console.log("Navigating to Sign-Up form...");
    document.getElementById("loginForm").classList.remove("active");
    document.getElementById("forgotPasswordForm").classList.remove("active");
    document.getElementById("signUpForm").classList.add("active");
    document.getElementById("userDashboard").classList.remove("active");
}
// Handle Sign-Up Button Click
function signUpUser() {
    console.log("Sign-Up button clicked!");

    const username = document.getElementById("signupUsername").value;
    const password = document.getElementById("signupPassword").value;

    if (!username || !password) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("User registered successfully!");
            alert(data.message || "User registered successfully!");
            showLogin(); // Redirect to Login after successful registration
        } else {
            alert(data.message || "Sign-Up failed!");
        }
    })
    .catch(error => {
        console.error("Error during Sign-Up:", error);
        alert("Something went wrong. Please try again later.");
    });
}
// Return to Login Form (optional for Forgot Password and Sign-Up forms)
function showLogin() {
    console.log("Returning to Login form...");
    document.getElementById("loginForm").classList.add("active");
    document.getElementById("forgotPasswordForm").classList.remove("active");
    document.getElementById("signUpForm").classList.remove("active");
    document.getElementById("userDashboard").classList.remove("active");
}
// Go Back Functionality
function goBack() {
    console.log("Back button clicked!");
    showLogin(); // Redirect back to the Login page
}

// Submit Metrics Functionality
function submitMetrics() {
    console.log("Submit Metrics button clicked!");

    const heartRate = document.getElementById("heartRate").value;
    const temperature = document.getElementById("temperature").value;
    const steps = document.getElementById("steps").value;

    if (!heartRate || !temperature || !steps) {
        alert("Please fill in all fields.");
        return;
    }

    fetch('/submit_metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: document.getElementById("loggedInUser").textContent, // Use logged-in user
            metrics: { heart_rate: heartRate, temperature, steps }
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message || "Metrics submitted successfully!");
    })
    .catch(error => {
        console.error("Error during metrics submission:", error);
    });
}

// Logout Functionality
function logout() {
    console.log("Logout button clicked!");
    showLogin(); // Redirect back to the Login page
}