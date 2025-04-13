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

    const heartRate = document.getElementById("heartRate").value.trim();
    const temperature = document.getElementById("temperature").value.trim();
    const steps = document.getElementById("steps").value.trim();

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
    .then(response => {
        if (!response.ok) {
            throw new Error("Metrics submission failed.");
        }
        return response.json();
    })
    .then(data => {
        alert(data.message || "Metrics submitted successfully!");
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