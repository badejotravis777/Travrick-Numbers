let attempts = 0;
let maxAttempts = 30; // Default for beginner mode
let userPoints = 0;
let loggedInUser = null;
let targetNumber = 0;

// Function to handle login
function login(username, password) {
    // Example hardcoded user for demonstration
    if (localStorage.getItem(username) === password) {
        loggedInUser = username;
        document.getElementById("username").textContent = loggedInUser;
        document.getElementById("welcome-message").classList.remove("hidden");
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("game-container").classList.remove("hidden");
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

// Function to handle sign up
function signUp(username, email, password) {
    localStorage.setItem(username, password);
    loggedInUser = username;
    document.getElementById("username").textContent = loggedInUser;
    document.getElementById("welcome-message").classList.remove("hidden");
    document.getElementById("auth-container").classList.add("hidden");
    document.getElementById("game-container").classList.remove("hidden");
}

// Add event listeners for login and sign up
document.getElementById("login-button").addEventListener("click", function() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    login(username, password);
});

document.getElementById("signup-button").addEventListener("click", function() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    signUp(username, email, password);
});

// Switch between login and sign-up forms
document.getElementById("show-signup").addEventListener("click", function() {
    document.getElementById("login-form").classList.add("hidden");
    document.getElementById("signup-form").classList.remove("hidden");
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("signup-form").classList.add("hidden");
    document.getElementById("login-form").classList.remove("hidden");
});

// Game mode selection
let selectedMode = "beginner";
document.querySelectorAll(".game-mode").forEach(button => {
    button.addEventListener("click", function() {
        document.querySelectorAll(".game-mode").forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        selectedMode = this.id.split('-')[0];
        if (selectedMode === "beginner") {
            maxAttempts = 30;
        } else if (selectedMode === "intermediate") {
            maxAttempts = 15;
        } else {
            maxAttempts = 10;
        }
    });
});

// Function to start the game
document.getElementById("start-game").addEventListener("click", function() {
    if (loggedInUser) {
        document.getElementById("game-area").classList.remove("hidden");
        attempts = 0;
        targetNumber = Math.floor(Math.random() * 100) + 1;
        document.getElementById("attempts-left").textContent = maxAttempts;
        document.getElementById("hint-message").textContent = "";
    } else {
        alert("Please login or sign up to start the game.");
    }
});

// Function to handle submitting a guess
document.getElementById("submit-guess").addEventListener("click", function() {
    if (loggedInUser) {
        let userGuess = parseInt(document.getElementById("user-input").value);
        attempts++;
        document.getElementById("attempts-left").textContent = maxAttempts - attempts;

        if (userGuess === targetNumber) {
            userPoints += 10;
            document.getElementById("user-points").textContent = userPoints;
            document.getElementById("hint-message").textContent = "Congratulations! You guessed correctly.";
        } else if (userGuess < targetNumber) {
            document.getElementById("hint-message").textContent = "Try again! Your guess is too low.";
        } else {
            document.getElementById("hint-message").textContent = "Try again! Your guess is too high.";
        }

        if (attempts >= maxAttempts) {
            document.getElementById("hint-message").textContent = `Game over! The correct number was ${targetNumber}.`;
        }
    } else {
        alert("Please login or sign up to play the game.");
    }
})