// Game variables
const buttonColours = ["red", "blue", "green", "yellow"];
let gamePattern = [];
let userClickedPattern = [];
let started = false;
let level = 0;
let score = 0;
let bestScore = localStorage.getItem("simonBestScore") || 0;
let soundEnabled = true;
let isShowingSequence = false;
let sequenceTimeout;

// Sound frequencies for each color
const soundFreqs = {
  green: 329.63, // E4
  red: 261.63, // C4
  yellow: 392.0, // G4
  blue: 220.0, // A3
  wrong: 150, // Low frequency for error
};

// Initialize game
document.addEventListener("DOMContentLoaded", function () {
  createStars();
  updateDisplays();
  setupEventListeners();
});

function createStars() {
  const starsContainer = document.getElementById("stars");
  for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.className = "star";
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.width = Math.random() * 3 + 1 + "px";
    star.style.height = star.style.width;
    star.style.animationDelay = Math.random() * 3 + "s";
    star.style.animationDuration = Math.random() * 2 + 2 + "s";
    starsContainer.appendChild(star);
  }
}

function setupEventListeners() {
  // Keyboard controls
  document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
      event.preventDefault();
      if (!started) {
        startGame();
      }
    } else if (event.key === "r" || event.key === "R") {
      resetGame();
    }
  });

  // Button clicks
  document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", function () {
      if (started && !isShowingSequence) {
        const userChosenColour = this.getAttribute("data-color");
        userClickedPattern.push(userChosenColour);
        playSound(userChosenColour);
        animatePress(userChosenColour);
        checkAnswer(userClickedPattern.length - 1);
      }
    });
  });
}

function startGame() {
  if (!started) {
    document.getElementById("level-title").textContent =
      "Watch the sequence...";
    document.getElementById("start-btn").disabled = true;
    nextSequence();
    started = true;
  }
}

function resetGame() {
  clearTimeout(sequenceTimeout);
  level = 0;
  score = 0;
  gamePattern = [];
  userClickedPattern = [];
  started = false;
  isShowingSequence = false;

  document.getElementById("level-title").textContent =
    "Press SPACE or Click START to Begin";
  document.getElementById("start-btn").disabled = false;
  document.body.classList.remove("game-over");
  document.getElementById("center-logo").classList.remove("active");

  updateDisplays();
  playSound("wrong", 200);
}

function nextSequence() {
  userClickedPattern = [];
  level++;
  score += level * 10; // Bonus points for higher levels

  document.getElementById("level-title").textContent = `Level ${level}`;
  updateDisplays();

  const randomNumber = Math.floor(Math.random() * 4);
  const randomChosenColour = buttonColours[randomNumber];
  gamePattern.push(randomChosenColour);

  // Show the entire sequence
  showSequence();
}

function showSequence() {
  isShowingSequence = true;
  document.getElementById("center-logo").classList.add("active");

  gamePattern.forEach((color, index) => {
    sequenceTimeout = setTimeout(() => {
      const button = document.getElementById(color);
      button.classList.add("active");
      playSound(color);

      setTimeout(() => {
        button.classList.remove("active");

        // If this is the last color in sequence
        if (index === gamePattern.length - 1) {
          setTimeout(() => {
            isShowingSequence = false;
            document.getElementById("center-logo").classList.remove("active");
            document.getElementById("level-title").textContent = "Your turn!";
          }, 500);
        }
      }, 400);
    }, (index + 1) * 700);
  });
}

function checkAnswer(currentLevel) {
  if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
    if (userClickedPattern.length === gamePattern.length) {
      // Correct sequence completed
      showScoreAnimation("+" + level * 10);
      setTimeout(() => {
        nextSequence();
      }, 1000);
    }
  } else {
    // Wrong answer
    gameOver();
  }
}

function gameOver() {
  playSound("wrong", 500);
  document.body.classList.add("game-over");
  document.getElementById(
    "level-title"
  ).textContent = `Game Over! Final Score: ${score}`;

  // Update best score
  if (score > bestScore) {
    bestScore = score;
    localStorage.setItem("simonBestScore", bestScore);
    showScoreAnimation("NEW BEST!");
  }

  setTimeout(() => {
    document.body.classList.remove("game-over");
    document.getElementById("level-title").textContent =
      "Press SPACE or Click START to Play Again";
  }, 1500);

  setTimeout(() => {
    resetGame();
  }, 3000);
}

function animatePress(currentColor) {
  const button = document.getElementById(currentColor);
  button.classList.add("pressed");
  setTimeout(() => {
    button.classList.remove("pressed");
  }, 150);
}

function playSound(name, duration = 300) {
  if (!soundEnabled) return;

  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = soundFreqs[name] || 200;
  oscillator.type = name === "wrong" ? "sawtooth" : "sine";

  gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(
    0.01,
    audioContext.currentTime + duration / 1000
  );

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration / 1000);
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.querySelector(".sound-toggle");
  btn.textContent = soundEnabled ? "🔊" : "🔇";

  if (soundEnabled) {
    playSound("green", 200);
  }
}

function updateDisplays() {
  document.getElementById("level-display").textContent = level;
  document.getElementById("score-display").textContent = score;
  document.getElementById("best-score").textContent = bestScore;
}

function showScoreAnimation(text) {
  const animation = document.createElement("div");
  animation.className = "score-animation";
  animation.textContent = text;
  animation.style.left = "50%";
  animation.style.top = "40%";
  animation.style.transform = "translateX(-50%)";
  animation.style.position = "fixed";

  document.body.appendChild(animation);

  setTimeout(() => {
    animation.remove();
  }, 1000);
}

// Prevent context menu on buttons
document.addEventListener("contextmenu", function (e) {
  if (e.target.classList.contains("btn")) {
    e.preventDefault();
  }
});
