const ROWS = 20;
const COLS = 10;
const LEVEL_SPEEDS = [800, 650, 500, 400, 300, 200, 150, 100, 80, 60]; // ms por nivel

// Piezas (Tetrominos)
const SHAPES = {
  I: [[1, 1, 1, 1]],
  O: [[1, 1],[1, 1]],
  T: [[0, 1, 0],[1, 1, 1]],
  S: [[0, 1, 1],[1, 1, 0]],
  Z: [[1, 1, 0],[0, 1, 1]],
  J: [[1, 0, 0],[1, 1, 1]],
  L: [[0, 0, 1],[1, 1, 1]]
};

const COLORS = {
  I: "cyan", O: "yellow", T: "purple",
  S: "lime", Z: "red", J: "blue", L: "orange"
};

let gameState = {
  grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
  currentPiece: null,
  nextPiece: null,
  score: 0,
  lines: 0,
  level: 0,
  intervalId: null,
  isPaused: false,
  isGameOver: false
};

function createPiece(type) {
  return {
    shape: SHAPES[type],
    x: Math.floor(COLS / 2) - Math.ceil(SHAPES[type][0].length / 2),
    y: -1,
    color: COLORS[type]
  };
}

function randomPiece() {
  const keys = Object.keys(SHAPES);
  return createPiece(keys[Math.floor(Math.random() * keys.length)]);
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, i) => matrix.map(row => row[i]).reverse());
}

function drawGrid() {
  const gridEl = document.getElementById("gameGrid");
  gridEl.innerHTML = "";
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const cell = document.createElement("div");
      cell.className = "cell";
      if (gameState.grid[r][c]) {
        cell.classList.add("filled");
        cell.style.background = gameState.grid[r][c];
      }
      gridEl.appendChild(cell);
    }
  }
}

function drawPiece() {
  const { shape, x, y, color } = gameState.currentPiece;
  const cells = document.querySelectorAll(".cell");
  shape.forEach((row, r) => {
    row.forEach((val, c) => {
      if (val) {
        const gridRow = y + r, gridCol = x + c;
        if (gridRow >= 0 && gridRow < ROWS && gridCol >= 0 && gridCol < COLS) {
          const idx = gridRow * COLS + gridCol;
          cells[idx].style.background = color;
        }
      }
    });
  });
}

function updateDisplay() {
  drawGrid();
  drawPiece();
  document.getElementById("score").textContent = gameState.score;
  document.getElementById("lines").textContent = gameState.lines;
  document.getElementById("currentLevel").textContent = gameState.level + 1;
}

function isValidMove(shape, x, y) {
  return shape.every((row, r) =>
    row.every((val, c) => {
      if (!val) return true;
      const newX = x + c;
      const newY = y + r;
      return newY < ROWS &&
             newX >= 0 &&
             newX < COLS &&
             (newY < 0 || !gameState.grid[newY][newX]);
    })
  );
}

function movePiece(dx, dy) {
  const { shape, x, y } = gameState.currentPiece;
  if (isValidMove(shape, x + dx, y + dy)) {
    gameState.currentPiece.x += dx;
    gameState.currentPiece.y += dy;
    return true;
  }
  return false;
}

function dropPiece() {
  while (movePiece(0, 1)) {}
  placePiece();
}

function placePiece() {
  const { shape, x, y, color } = gameState.currentPiece;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[r].length; c++) {
      if (shape[r][c]) {
        const gr = y + r, gc = x + c;
        if (gr >= 0) {
          gameState.grid[gr][gc] = color;
        } else {
          return gameOver();
        }
      }
    }
  }
  checkLines();
  spawnNewPiece();
}

function rotatePiece() {
  const rotated = rotateMatrix(gameState.currentPiece.shape);
  if (isValidMove(rotated, gameState.currentPiece.x, gameState.currentPiece.y)) {
    gameState.currentPiece.shape = rotated;
  }
}

function checkLines() {
  let cleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    if (gameState.grid[r].every(cell => cell)) {
      gameState.grid.splice(r, 1);
      gameState.grid.unshift(Array(COLS).fill(null));
      cleared++;
      r++;
    }
  }
  if (cleared > 0) {
    gameState.lines += cleared;
    gameState.score += cleared * 100;
    gameState.level = Math.min(LEVEL_SPEEDS.length - 1, Math.floor(gameState.lines / 10));
    restartLoop();
  }
}

function gameLoop() {
  if (!movePiece(0, 1)) {
    placePiece();
  }
  updateDisplay();
}

function restartLoop() {
  clearInterval(gameState.intervalId);
  gameState.intervalId = setInterval(gameLoop, LEVEL_SPEEDS[gameState.level]);
}

function spawnNewPiece() {
  gameState.currentPiece = gameState.nextPiece || randomPiece();
  gameState.nextPiece = randomPiece();
}

function togglePause() {
  gameState.isPaused = !gameState.isPaused;
  if (gameState.isPaused) {
    clearInterval(gameState.intervalId);
  } else {
    restartLoop();
  }
}

function gameOver() {
  clearInterval(gameState.intervalId);
  gameState.isGameOver = true;
  document.getElementById("gameOverOverlay").style.display = "flex";
  document.getElementById("finalStats").textContent =
    `Score: ${gameState.score} | Lines: ${gameState.lines}`;
}

document.addEventListener("keydown", e => {
  if (gameState.isGameOver) return;
  if (e.code === "ArrowLeft") movePiece(-1, 0);
  if (e.code === "ArrowRight") movePiece(1, 0);
  if (e.code === "ArrowDown") movePiece(0, 1);
  if (e.code === "Space") dropPiece();
  if (e.code === "ArrowUp") rotatePiece();
  if (e.code === "KeyP") togglePause();
  updateDisplay();
});

function startGame() {
  gameState.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  gameState.score = 0;
  gameState.lines = 0;
  gameState.level = 0;
  gameState.isPaused = false;
  gameState.isGameOver = false;
  document.getElementById("gameOverOverlay").style.display = "none";

  spawnNewPiece();
  restartLoop();
  updateDisplay();
}

document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("pauseBtn").addEventListener("click", togglePause);
