let attempts = 0;
let maxAttempts = 30; // Default for beginner mode
let userPoints = 0;
let loggedInUser = null;
let targetNumber = 0;

// Initialize the user data from localStorage
let userData = JSON.parse(localStorage.getItem('userData')) || {};

// Function to handle login
function login(username, password) {
    if (userData[username] && userData[username].password === password) {
        loggedInUser = username;
        userPoints = userData[username].points;
        document.getElementById("username").textContent = loggedInUser;
        document.getElementById("user-points").textContent = userPoints;
        document.getElementById("welcome-message").classList.remove("hidden");
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("game-container").classList.remove("hidden");
    } else {
        document.getElementById("login-error").classList.remove("hidden");
    }
}

// Function to handle sign up
function signUp(username, email, password) {
    if (!userData[username]) {
        userData[username] = { email: email, password: password, points: 0, matches: [] };
        localStorage.setItem('userData', JSON.stringify(userData));
        loggedInUser = username;
        userPoints = 0;
        document.getElementById("username").textContent = loggedInUser;
        document.getElementById("user-points").textContent = userPoints;
        document.getElementById("welcome-message").classList.remove("hidden");
        document.getElementById("auth-container").classList.add("hidden");
        document.getElementById("game-container").classList.remove("hidden");
    } else {
        document.getElementById("signup-error").classList.remove("hidden");
    }
}

// Add event listeners for login and sign up
document.getElementById("login-button").addEventListener("click", function() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    if (username && password) {
        login(username, password);
    } else {
        alert("Please fill in all fields.");
    }
});

document.getElementById("signup-button").addEventListener("click", function() {
    const username = document.getElementById("signup-username").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    if (username && email && password) {
        signUp(username, email, password);
    } else {
        alert("Please fill in all fields.");
    }
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
        resetGame();
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
        document.getElementById("submit-guess").disabled = false;
        document.getElementById("user-input").disabled = false;
    } else {
        alert("Please login or sign up to start the game.");
    }
});

// Function to handle submitting a guess
document.getElementById("submit-guess").addEventListener("click", function() {
    if (loggedInUser) {
        let userGuess = parseInt(document.getElementById("user-input").value);
        if (!isNaN(userGuess)) {
            attempts++;
            document.getElementById("attempts-left").textContent = maxAttempts - attempts;

            if (userGuess === targetNumber) {
                if (selectedMode === "beginner") {
                    userPoints += 5;
                } else if (selectedMode === "intermediate") {
                    userPoints += 10;
                } else {
                    userPoints += 20;
                }

                userData[loggedInUser].points = userPoints;
                document.getElementById("user-points").textContent = userPoints;
                document.getElementById("hint-message").textContent = "Congratulations! You guessed correctly.";
                
                // Push the match data into the matches array
                userData[loggedInUser].matches.push({
                    mode: selectedMode,
                    result: 'Win',
                    attempts: attempts
                });

                document.getElementById("submit-guess").disabled = true;
                document.getElementById("user-input").disabled = true;
            } else if (userGuess < targetNumber) {
                if (selectedMode !== "expert" && (selectedMode !== "intermediate" || attempts <= 10)) {
                    document.getElementById("hint-message").textContent = "Try again! Your guess is too low.";
                } else {
                    document.getElementById("hint-message").textContent = "Try again!";
                }
            } else {
                if (selectedMode !== "expert" && (selectedMode !== "intermediate" || attempts <= 10)) {
                    document.getElementById("hint-message").textContent = "Try again! Your guess is too high.";
                } else {
                    document.getElementById("hint-message").textContent = "Try again!";
                }
            }

            if (attempts >= maxAttempts) {
                document.getElementById("hint-message").textContent = `Game over! The correct number was ${targetNumber}.`;
                
                // Push the match data into the matches array
                userData[loggedInUser].matches.push({
                    mode: selectedMode,
                    result: 'Lose',
                    attempts: attempts
                });

                document.getElementById("submit-guess").disabled = true;
                document.getElementById("user-input").disabled = true;
            }
            
            localStorage.setItem('userData', JSON.stringify(userData));
        } else {
            alert("Please enter a valid number.");
        }
    } else {
        alert("Please login or sign up to play the game.");
    }
});

// Function to quit the game
document.getElementById("quit-game").addEventListener("click", function() {
    if (loggedInUser) {
        document.getElementById("game-area").classList.add("hidden");
        document.getElementById("hint-message").textContent = "";
        document.getElementById("submit-guess").disabled = false;
        document.getElementById("user-input").disabled = false;
    }
});

// Function to show past matches
document.getElementById("show-past-matches").addEventListener("click", function() {
    if (loggedInUser) {
        const matches = userData[loggedInUser].matches;
        if (matches.length > 0) {
            let matchesList = matches.map(match => `Mode: ${match.mode}, Result: ${match.result}, Attempts: ${match.attempts}`).join('<br>');
            document.getElementById("past-matches").innerHTML = `<h3>Past Matches:</h3>${matchesList}`;
        } else {
            document.getElementById("past-matches").innerHTML = "<h3>No past matches found.</h3>";
        }
    } else {
        alert("Please login or sign up to view past matches.");
    }
});

// Function to reset the game
function resetGame() {
    document.getElementById("game-area").classList.add("hidden");
    document.getElementById("hint-message").textContent = "";
    document.getElementById("submit-guess").disabled = true;
    document.getElementById("user-input").disabled = true;
}
