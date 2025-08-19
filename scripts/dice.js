let soundEnabled = !0;
let player1Total = 0;
let player2Total = 0;
let isRolling = !1;
const diceFaces = { 1: "⚀", 2: "⚁", 3: "⚂", 4: "⚃", 5: "⚄", 6: "⚅" };
function createParticles() {
  for (let i = 0; i < 15; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";
    particle.style.width = Math.random() * 10 + 5 + "px";
    particle.style.height = particle.style.width;
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";
    document.body.appendChild(particle);
  }
}
function createConfetti() {
  const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#FFE066", "#FF8E53"];
  for (let i = 0; i < 50; i++) {
    setTimeout(() => {
      const confetti = document.createElement("div");
      confetti.className = "confetti";
      confetti.style.left = Math.random() * 100 + "%";
      confetti.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = Math.random() * 3 + "s";
      confetti.style.borderRadius = Math.random() > 0.5 ? "50%" : "0";
      document.body.appendChild(confetti);
      setTimeout(() => {
        confetti.remove();
      }, 3000);
    }, i * 50);
  }
}
function playSound(frequency, duration = 200, type = "sine") {
  if (!soundEnabled) return;
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  oscillator.frequency.value = frequency;
  oscillator.type = type;
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
    playSound(800, 100);
  }
}
async function rollDice() {
  if (isRolling) return;
  isRolling = !0;
  const rollBtn = document.getElementById("rollBtn");
  rollBtn.disabled = !0;
  rollBtn.textContent = "🎲 Rodando...";
  const dice1 = document.getElementById("dice1");
  const dice2 = document.getElementById("dice2");
  dice1.classList.add("rolling");
  dice2.classList.add("rolling");
  playSound(400, 100);
  let rollCount = 0;
  const rollInterval = setInterval(() => {
    const tempRoll1 = Math.floor(Math.random() * 6) + 1;
    const tempRoll2 = Math.floor(Math.random() * 6) + 1;
    dice1.textContent = diceFaces[tempRoll1];
    dice2.textContent = diceFaces[tempRoll2];
    rollCount++;
    if (rollCount > 10) {
      clearInterval(rollInterval);
    }
  }, 100);
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const roll1 = Math.floor(Math.random() * 6) + 1;
  const roll2 = Math.floor(Math.random() * 6) + 1;
  dice1.textContent = diceFaces[roll1];
  dice2.textContent = diceFaces[roll2];
  dice1.classList.remove("rolling");
  dice2.classList.remove("rolling");
  player1Total += roll1;
  player2Total += roll2;
  document.getElementById("score1").textContent = `Último: ${roll1}`;
  document.getElementById("score2").textContent = `Último: ${roll2}`;
  document.getElementById("total1").textContent = player1Total;
  document.getElementById("total2").textContent = player2Total;
  const gameTitle = document.getElementById("gameTitle");
  const player1Div = document.querySelector(".player1");
  const player2Div = document.querySelector(".player2");
  player1Div.classList.remove("winner");
  player2Div.classList.remove("winner");
  if (roll1 > roll2) {
    gameTitle.textContent = "¡Jugador 1 Gana esta Ronda! ";
    player1Div.classList.add("winner");
    playSound(600, 300, "square");
    setTimeout(() => playSound(800, 200, "square"), 150);
  } else if (roll2 > roll1) {
    gameTitle.textContent = " ¡Jugador 2 Gana esta Ronda! ";
    player2Div.classList.add("winner");
    playSound(600, 300, "square");
    setTimeout(() => playSound(800, 200, "square"), 150);
  } else {
    gameTitle.textContent = "🤝 ¡Empate! ¡Ambos son geniales! ";
    playSound(500, 400, "triangle");
  }
  if (player1Total >= 50 || player2Total >= 50) {
    setTimeout(() => {
      const overallWinner =
        player1Total > player2Total
          ? "Jugador 1"
          : player2Total > player1Total
          ? " Jugador 2"
          : "Empate";
      gameTitle.textContent = `🏆 ¡${overallWinner} Gana el Juego! 🏆`;
      createConfetti();
      playSound(523, 200);
      setTimeout(() => playSound(659, 200), 200);
      setTimeout(() => playSound(784, 200), 400);
      setTimeout(() => playSound(1047, 400), 600);
    }, 1000);
  }
  rollBtn.disabled = !1;
  rollBtn.textContent = "¡LANZAR DADOS!";
  isRolling = !1;
}
function resetGame() {
  player1Total = 0;
  player2Total = 0;
  document.getElementById("dice1").textContent = "🎲";
  document.getElementById("dice2").textContent = "🎲";
  document.getElementById("score1").textContent = "Puntuación: 0";
  document.getElementById("score2").textContent = "Puntuación: 0";
  document.getElementById("total1").textContent = "0";
  document.getElementById("total2").textContent = "0";
  document.getElementById("gameTitle").textContent =
    "🎲 ¡Lanza los Dados Mágicos! 🎲";
  document.querySelector(".player1").classList.remove("winner");
  document.querySelector(".player2").classList.remove("winner");
  playSound(400, 150);
  setTimeout(() => playSound(350, 150), 100);
}
window.addEventListener("load", () => {
  createParticles();
  document.getElementById("dice1").addEventListener("click", () => {
    playSound(300, 100);
  });
  document.getElementById("dice2").addEventListener("click", () => {
    playSound(300, 100);
  });
});
document.addEventListener("keydown", (event) => {
  if (event.code === "Space" || event.key === "Enter") {
    event.preventDefault();
    rollDice();
  } else if (event.key === "r" || event.key === "R") {
    resetGame();
  }
});
