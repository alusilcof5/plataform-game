const ROWS = 20;
        const COLS = 10;
        const LEVEL_SPEEDS = [800, 650, 500, 400, 300, 250, 200, 150, 120, 100, 80];
        
        // Definición de piezas (Tetrominos)
        const SHAPES = {
            I: [
                [0, 0, 0, 0],
                [1, 1, 1, 1],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ],
            O: [
                [1, 1],
                [1, 1]
            ],
            T: [
                [0, 1, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            S: [
                [0, 1, 1],
                [1, 1, 0],
                [0, 0, 0]
            ],
            Z: [
                [1, 1, 0],
                [0, 1, 1],
                [0, 0, 0]
            ],
            J: [
                [1, 0, 0],
                [1, 1, 1],
                [0, 0, 0]
            ],
            L: [
                [0, 0, 1],
                [1, 1, 1],
                [0, 0, 0]
            ]
        };

        const COLORS = {
            I: "#00f0f0", O: "#f0f000", T: "#a000f0",
            S: "#00f000", Z: "#f00000", J: "#0000f0", L: "#f0a000"
        };

        // Estado del juego
        let gameState = {
            grid: Array.from({ length: ROWS }, () => Array(COLS).fill(null)),
            currentPiece: null,
            nextPiece: null,
            score: 0,
            lines: 0,
            level: 1,
            startLevel: 1,
            intervalId: null,
            isPaused: false,
            isGameOver: false,
            isGameStarted: false
        };

        // Funciones de creación de piezas
        function createPiece(type) {
            return {
                shape: SHAPES[type],
                x: Math.floor(COLS / 2) - Math.ceil(SHAPES[type][0].length / 2),
                y: -1,
                color: COLORS[type],
                type: type
            };
        }

        function getRandomPieceType() {
            const keys = Object.keys(SHAPES);
            return keys[Math.floor(Math.random() * keys.length)];
        }

        function rotateMatrix(matrix) {
            const rows = matrix.length;
            const cols = matrix[0].length;
            const rotated = Array.from({ length: cols }, () => Array(rows).fill(0));
            
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    rotated[c][rows - 1 - r] = matrix[r][c];
                }
            }
            return rotated;
        }

        // Funciones de renderizado
        function initializeGrid() {
            const gridEl = document.getElementById("gameGrid");
            gridEl.innerHTML = "";
            
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    const cell = document.createElement("div");
                    cell.className = "cell";
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    gridEl.appendChild(cell);
                }
            }
        }

        function initializeNextPieceGrid() {
            const nextGridEl = document.getElementById("nextPieceGrid");
            nextGridEl.innerHTML = "";
            
            for (let r = 0; r < 4; r++) {
                for (let c = 0; c < 4; c++) {
                    const cell = document.createElement("div");
                    cell.className = "next-cell";
                    cell.dataset.row = r;
                    cell.dataset.col = c;
                    nextGridEl.appendChild(cell);
                }
            }
        }

        function drawGrid() {
            const cells = document.querySelectorAll(".cell");
            
            // Limpiar todas las celdas
            cells.forEach(cell => {
                cell.classList.remove("filled");
                cell.style.backgroundColor = "";
            });
            
            // Dibujar piezas fijas
            for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                    if (gameState.grid[r][c]) {
                        const idx = r * COLS + c;
                        cells[idx].classList.add("filled");
                        cells[idx].style.backgroundColor = gameState.grid[r][c];
                    }
                }
            }
        }

        function drawCurrentPiece() {
            if (!gameState.currentPiece) return;
            
            const { shape, x, y, color } = gameState.currentPiece;
            const cells = document.querySelectorAll(".cell");
            
            shape.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val) {
                        const gridRow = y + r;
                        const gridCol = x + c;
                        if (gridRow >= 0 && gridRow < ROWS && gridCol >= 0 && gridCol < COLS) {
                            const idx = gridRow * COLS + gridCol;
                            if (cells[idx]) {
                                cells[idx].classList.add("filled");
                                cells[idx].style.backgroundColor = color;
                            }
                        }
                    }
                });
            });
        }

        function drawNextPiece() {
            const nextCells = document.querySelectorAll(".next-cell");
            
            // Limpiar celdas del next piece
            nextCells.forEach(cell => {
                cell.classList.remove("filled");
                cell.style.backgroundColor = "";
            });
            
            if (!gameState.nextPiece) return;
            
            const { shape, color } = gameState.nextPiece;
            const startRow = Math.floor((4 - shape.length) / 2);
            const startCol = Math.floor((4 - shape[0].length) / 2);
            
            shape.forEach((row, r) => {
                row.forEach((val, c) => {
                    if (val) {
                        const cellRow = startRow + r;
                        const cellCol = startCol + c;
                        if (cellRow >= 0 && cellRow < 4 && cellCol >= 0 && cellCol < 4) {
                            const idx = cellRow * 4 + cellCol;
                            if (nextCells[idx]) {
                                nextCells[idx].classList.add("filled");
                                nextCells[idx].style.backgroundColor = color;
                            }
                        }
                    }
                });
            });
        }

        function updateDisplay() {
            drawGrid();
            drawCurrentPiece();
            drawNextPiece();
            
            document.getElementById("score").textContent = gameState.score.toLocaleString();
            document.getElementById("lines").textContent = gameState.lines;
            document.getElementById("currentLevel").textContent = gameState.level;
        }

        // Funciones de lógica del juego
        function isValidMove(shape, x, y) {
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c]) {
                        const newX = x + c;
                        const newY = y + r;
                        
                        if (newX < 0 || newX >= COLS || newY >= ROWS) {
                            return false;
                        }
                        
                        if (newY >= 0 && gameState.grid[newY][newX]) {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

        function movePiece(dx, dy) {
            if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return false;
            
            const { shape, x, y } = gameState.currentPiece;
            if (isValidMove(shape, x + dx, y + dy)) {
                gameState.currentPiece.x += dx;
                gameState.currentPiece.y += dy;
                return true;
            }
            return false;
        }

        function rotatePiece() {
            if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;
            
            const rotated = rotateMatrix(gameState.currentPiece.shape);
            if (isValidMove(rotated, gameState.currentPiece.x, gameState.currentPiece.y)) {
                gameState.currentPiece.shape = rotated;
                updateDisplay();
            }
        }

        function dropPiece() {
            if (!gameState.currentPiece || gameState.isPaused || gameState.isGameOver) return;
            
            let dropCount = 0;
            while (movePiece(0, 1)) {
                dropCount++;
            }
            
            if (dropCount > 0) {
                gameState.score += dropCount * 2; // Puntos bonus por drop
                placePiece();
            }
        }

        function placePiece() {
            if (!gameState.currentPiece) return;
            
            const { shape, x, y, color } = gameState.currentPiece;
            
            // Verificar game over antes de colocar
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c] && y + r < 0) {
                        gameOver();
                        return;
                    }
                }
            }
            
            // Colocar la pieza en el grid
            for (let r = 0; r < shape.length; r++) {
                for (let c = 0; c < shape[r].length; c++) {
                    if (shape[r][c]) {
                        const gridRow = y + r;
                        const gridCol = x + c;
                        if (gridRow >= 0) {
                            gameState.grid[gridRow][gridCol] = color;
                        }
                    }
                }
            }
            
            checkLines();
            spawnNewPiece();
        }

        function checkLines() {
            let linesCleared = 0;
            
            for (let r = ROWS - 1; r >= 0; r--) {
                if (gameState.grid[r].every(cell => cell !== null)) {
                    gameState.grid.splice(r, 1);
                    gameState.grid.unshift(Array(COLS).fill(null));
                    linesCleared++;
                    r++; // Revisar la misma fila otra vez
                }
            }
            
            if (linesCleared > 0) {
                gameState.lines += linesCleared;
                
                // Calcular puntuación basada en líneas simultáneas
                const linePoints = {
                    1: 100,
                    2: 300,
                    3: 500,
                    4: 800
                };
                
                gameState.score += (linePoints[linesCleared] || 100) * gameState.level;
                
                // Aumentar nivel cada 10 líneas
                const newLevel = gameState.startLevel + Math.floor(gameState.lines / 10);
                if (newLevel !== gameState.level && newLevel <= LEVEL_SPEEDS.length) {
                    gameState.level = newLevel;
                    restartGameLoop();
                }
            }
        }

        function spawnNewPiece() {
            gameState.currentPiece = gameState.nextPiece || createPiece(getRandomPieceType());
            gameState.nextPiece = createPiece(getRandomPieceType());
            
            // Verificar si la nueva pieza puede ser colocada
            if (!isValidMove(gameState.currentPiece.shape, gameState.currentPiece.x, gameState.currentPiece.y)) {
                gameOver();
            }
        }

        // Funciones del loop del juego
        function gameLoop() {
            if (gameState.isPaused || gameState.isGameOver) return;
            
            if (!movePiece(0, 1)) {
                placePiece();
            }
            updateDisplay();
        }

        function restartGameLoop() {
            if (gameState.intervalId) {
                clearInterval(gameState.intervalId);
            }
            
            if (!gameState.isPaused && !gameState.isGameOver) {
                const speed = LEVEL_SPEEDS[Math.min(gameState.level - 1, LEVEL_SPEEDS.length - 1)];
                gameState.intervalId = setInterval(gameLoop, speed);
            }
        }

        // Funciones de control del juego
        function startGame() {
            // Reiniciar estado
            gameState.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
            gameState.currentPiece = null;
            gameState.nextPiece = null;
            gameState.score = 0;
            gameState.lines = 0;
            gameState.level = gameState.startLevel;
            gameState.isPaused = false;
            gameState.isGameOver = false;
            gameState.isGameStarted = true;
            
            // Ocultar overlay de game over
            document.getElementById("gameOverOverlay").style.display = "none";
            document.getElementById("pauseIndicator").style.display = "none";
            
            // Spawner primera pieza
            spawnNewPiece();
            
            // Iniciar loop del juego
            restartGameLoop();
            updateDisplay();
            
            console.log("Juego iniciado en nivel:", gameState.startLevel);
        }

        function togglePause() {
            if (!gameState.isGameStarted || gameState.isGameOver) return;
            
            gameState.isPaused = !gameState.isPaused;
            
            if (gameState.isPaused) {
                clearInterval(gameState.intervalId);
                document.getElementById("pauseIndicator").style.display = "block";
                document.getElementById("pauseBtn").textContent = "▶️ Reanudar";
            } else {
                restartGameLoop();
                document.getElementById("pauseIndicator").style.display = "none";
                document.getElementById("pauseBtn").textContent = "⏸️ Pausa";
            }
        }

        function resetGame() {
            if (gameState.intervalId) {
                clearInterval(gameState.intervalId);
            }
            
            gameState.isGameStarted = false;
            gameState.isGameOver = false;
            gameState.isPaused = false;
            
            document.getElementById("gameOverOverlay").style.display = "none";
            document.getElementById("pauseIndicator").style.display = "none";
            document.getElementById("pauseBtn").textContent = "⏸️ Pausa";
            
            // Reiniciar grid visual
            gameState.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
            gameState.currentPiece = null;
            gameState.nextPiece = null;
            gameState.score = 0;
            gameState.lines = 0;
            gameState.level = gameState.startLevel;
            
            updateDisplay();
        }

        function gameOver() {
            clearInterval(gameState.intervalId);
            gameState.isGameOver = true;
            gameState.isGameStarted = false;
            
            document.getElementById("finalStats").textContent = 
                `Puntuación: ${gameState.score.toLocaleString()} | Líneas: ${gameState.lines} | Nivel: ${gameState.level}`;
            document.getElementById("gameOverOverlay").style.display = "flex";
            
            console.log("Game Over - Puntuación final:", gameState.score);
        }

        // Función para cambiar nivel inicial
        function setStartLevel(level) {
            if (gameState.isGameStarted) return; // No cambiar durante el juego
            
            gameState.startLevel = level;
            gameState.level = level;
            
            // Actualizar botones activos
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelector(`[data-level="${level}"]`).classList.add('active');
            
            updateDisplay();
            console.log("Nivel inicial cambiado a:", level);
        }

        // Inicialización
        function initializeGame() {
            initializeGrid();
            initializeNextPieceGrid();
            
            // Crear botones de nivel
            const levelButtonsContainer = document.getElementById("levelButtons");
            for (let i = 1; i <= 10; i++) {
                const btn = document.createElement("button");
                btn.className = "level-btn";
                btn.textContent = i;
                btn.dataset.level = i;
                if (i === 1) btn.classList.add("active");
                btn.addEventListener("click", () => setStartLevel(i));
                levelButtonsContainer.appendChild(btn);
            }
            
            updateDisplay();
        }

        // Event listeners
        document.addEventListener("keydown", (e) => {
            if (gameState.isGameOver) return;
            
            switch(e.code) {
                case "ArrowLeft":
                    e.preventDefault();
                    if (movePiece(-1, 0)) updateDisplay();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    if (movePiece(1, 0)) updateDisplay();
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    if (movePiece(0, 1)) {
                        gameState.score += 1; // Punto bonus por bajar rápido
                        updateDisplay();
                    }
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    rotatePiece();
                    break;
                case "Space":
                    e.preventDefault();
                    dropPiece();
                    break;
                case "KeyP":
                    e.preventDefault();
                    togglePause();
                    break;
            }
        });

        document.getElementById("startBtn").addEventListener("click", startGame);
        document.getElementById("pauseBtn").addEventListener("click", togglePause);
        document.getElementById("resetBtn").addEventListener("click", resetGame);

        // Inicializar juego al cargar la página
        window.addEventListener("DOMContentLoaded", initializeGame);