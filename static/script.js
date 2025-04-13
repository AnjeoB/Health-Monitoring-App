
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

    // Retrieve and parse input values
    const heartRate = parseInt(document.getElementById("heartRate").value.trim());
    const temperature = parseFloat(document.getElementById("temperature").value.trim());
    const steps = parseInt(document.getElementById("steps").value.trim());

    // Validation
    if (isNaN(heartRate) || heartRate < 30 || heartRate > 250) {
        alert("Please enter a valid heart rate between 30 and 250 bpm.");
        return;
    }
    if (isNaN(temperature) || temperature < 35 || temperature > 42) {
        alert("Please enter a valid body temperature between 35°C and 42°C.");
        return;
    }
    if (isNaN(steps) || steps < 0) {
        alert("Please enter a valid number of steps (0 or higher).");
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
            // Display confirmation banner
            const banner = document.getElementById("confirmationBanner");
            banner.style.display = "block"; // Show the banner

            // Hide banner after 3 seconds
            setTimeout(() => {
                banner.style.display = "none";
            }, 3000);

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

            // Update Submission History
            const historyTableBody = document.getElementById("historyTableBody");
            const newRow = document.createElement("tr");

            // Add current date and time
            const currentDate = new Date().toLocaleString();
            newRow.innerHTML = `
                <td>${currentDate}</td>
                <td>${heartRate}</td>
                <td>${temperature}</td>
                <td>${steps}</td>
            `;

            historyTableBody.appendChild(newRow); // Append the new row to the table

            // Clear input fields for fresh submission
            document.getElementById("heartRate").value = "";
            document.getElementById("temperature").value = "";
            document.getElementById("steps").value = "";
        } else {
            alert(data.message || "Metrics submission failed.");
        }
    })
    .catch(error => {
        console.error("Error during metrics submission:", error);
        alert("Metrics submission failed. Please try again.");
    });
// Update the chart after adding data to the table
updateChart();
}
function generateReport() {
    console.log("Generating report...");

    // Retrieve the history table body
    const historyTableBody = document.getElementById("historyTableBody");
    const rows = historyTableBody.querySelectorAll("tr");

    if (rows.length === 0) {
        alert("No data available to generate a report.");
        return;
    }

    // Compile report data
    let reportContent = "Submission History Report\n\n";
    reportContent += "Date\t\tHeart Rate (bpm)\tTemperature (°C)\tSteps\n";
    reportContent += "---------------------------------------------------------------\n";

    rows.forEach(row => {
        const cells = row.querySelectorAll("td");
        const date = cells[0].innerText;
        const heartRate = cells[1].innerText;
        const temperature = cells[2].innerText;
        const steps = cells[3].innerText;

        reportContent += `${date}\t${heartRate}\t\t${temperature}\t\t${steps}\n`;
    });

    // Download the report as a .txt file
    const blob = new Blob([reportContent], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "submission_report.txt";
    link.click();

    console.log("Report generated successfully!");
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

    // Clear user-specific data
    document.getElementById("welcomeMessage").textContent = ""; // Clear welcome message
    document.getElementById("heartRate").value = ""; // Reset heart rate input
    document.getElementById("temperature").value = ""; // Reset temperature input
    document.getElementById("steps").value = ""; // Reset steps input

    // Clear login inputs
    document.getElementById("username").value = ""; // Clear username input
    document.getElementById("password").value = ""; // Clear password input

    // Remove feedback from the screen
    const feedback = document.getElementById("userFeedback");
    if (feedback) {
        feedback.remove();
    }

    // Navigate back to the login form
    showLogin();

    // Notify the user
    alert("You have been logged out, and all previous data has been cleared.");
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
// Initialize the chart
let metricsChart;

