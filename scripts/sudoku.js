     // Variables globales
        let currentBoard = [], solutionBoard = [], selectedCell = null, selectedNumber = null;
        let gameStartTime = null, timerInterval = null, isGameComplete = false;

        // Inicializar juego
        function initGame() {
            createBoard();
            createNumberButtons();
            createInstructions();
            generateNewGame();
            setupEventListeners();
        }

        // Crear tablero
        function createBoard() {
            const board = document.getElementById('sudoku-board');
            board.innerHTML = '';
            for (let i = 0; i < 81; i++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                cell.dataset.index = i;
                cell.onclick = () => selectCell(i);
                board.appendChild(cell);
            }
        }

        // Crear botones de números
        function createNumberButtons() {
            const container = document.getElementById('number-input');
            for (let i = 1; i <= 9; i++) {
                const btn = document.createElement('button');
                btn.className = 'number-btn';
                btn.textContent = i;
                btn.onclick = () => selectNumber(i);
                container.appendChild(btn);
            }
        }

        // Crear contenido de instrucciones
        function createInstructions() {
            const instructions = [
                {title: '🎯 Objetivo', content: 'Completa la cuadrícula 9×9 con números del 1-9. Cada fila, columna y bloque 3×3 debe contener todos los números sin repetir.'},
                {title: '🎮 Controles', content: '• Click para seleccionar celdas<br>• Usa botones 1-9 o teclado<br>• Borrar: botón 🗑️ o Delete<br>• Resolver: completa automáticamente'},
                {title: '🎨 Colores', content: '• Grises: números fijos<br>• Amarillo: celda seleccionada<br>• Lila: fila/columna/bloque<br>• Rojo: número inválido'},
                {title: '⚙️ Dificultad', content: 'Fácil: más números dados<br>Difícil: menos números dados'},
                {title: '💡 Tips', content: 'Busca celdas con pocas posibilidades, usa eliminación, observa patrones y ¡ten paciencia!'}
            ];
            
            document.getElementById('modal-body').innerHTML = instructions.map(item => 
                `<div class="instruction-section"><h3>${item.title}</h3><p>${item.content}</p></div>`
            ).join('');
        }

        // Generar Sudoku válido
        function generateSudoku() {
            const board = Array(9).fill().map(() => Array(9).fill(0));
            fillBoard(board);
            return board;
        }

        // Rellenar tablero con backtracking
        function fillBoard(board) {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (board[row][col] === 0) {
                        const numbers = [1,2,3,4,5,6,7,8,9];
                        shuffleArray(numbers);
                        for (let num of numbers) {
                            if (isValidMove(board, row, col, num)) {
                                board[row][col] = num;
                                if (fillBoard(board)) return true;
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        // Validar movimiento
        function isValidMove(board, row, col, num) {
            for (let i = 0; i < 9; i++) {
                if (board[row][i] === num || board[i][col] === num) return false;
            }
            const boxRow = Math.floor(row/3)*3, boxCol = Math.floor(col/3)*3;
            for (let i = boxRow; i < boxRow+3; i++) {
                for (let j = boxCol; j < boxCol+3; j++) {
                    if (board[i][j] === num) return false;
                }
            }
            return true;
        }

        // Mezclar array
        function shuffleArray(array) {
            for (let i = array.length-1; i > 0; i--) {
                const j = Math.floor(Math.random()*(i+1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        // Generar nuevo juego
        function generateNewGame() {
            solutionBoard = generateSudoku();
            currentBoard = solutionBoard.map(row => [...row]);
            
            const difficulty = document.getElementById('difficulty').value;
            const cellsToRemove = difficulty === 'easy' ? 35 : 55;
            
            const positions = Array.from({length: 81}, (_, i) => i);
            shuffleArray(positions);
            
            for (let i = 0; i < cellsToRemove; i++) {
                const pos = positions[i];
                currentBoard[Math.floor(pos/9)][pos%9] = 0;
            }
            
            updateBoardDisplay();
            startTimer();
            isGameComplete = false;
            document.getElementById('success-message').style.display = 'none';
        }

        // Actualizar visualización
        function updateBoardDisplay() {
            const cells = document.querySelectorAll('.sudoku-cell');
            cells.forEach((cell, index) => {
                const row = Math.floor(index/9), col = index%9;
                const value = currentBoard[row][col];
                
                cell.textContent = value === 0 ? '' : value;
                cell.className = 'sudoku-cell';
                
                if (solutionBoard[row][col] === currentBoard[row][col] && value !== 0) {
                    cell.classList.add('prefilled');
                }
                
                if (value !== 0 && !cell.classList.contains('prefilled')) {
                    const testBoard = currentBoard.map((r, ri) => r.map((c, ci) => (ri === row && ci === col) ? 0 : c));
                    if (!isValidMove(testBoard, row, col, value)) {
                        cell.classList.add('invalid');
                    }
                }
            });
        }

        // Seleccionar celda
        function selectCell(index) {
            if (isGameComplete) return;
            const cells = document.querySelectorAll('.sudoku-cell');
            if (cells[index].classList.contains('prefilled')) return;
            
            cells.forEach(cell => cell.classList.remove('selected', 'highlighted'));
            
            selectedCell = index;
            cells[index].classList.add('selected');
            
            const row = Math.floor(index/9), col = index%9;
            cells.forEach((cell, i) => {
                const r = Math.floor(i/9), c = i%9;
                if (r === row || c === col || (Math.floor(r/3) === Math.floor(row/3) && Math.floor(c/3) === Math.floor(col/3))) {
                    cell.classList.add('highlighted');
                }
            });
        }

        // Seleccionar número
        function selectNumber(num) {
            document.querySelectorAll('.number-btn').forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            selectedNumber = num;
            if (selectedCell !== null) insertNumber(num);
        }

        // Insertar número
        function insertNumber(num) {
            if (selectedCell === null || isGameComplete) return;
            const row = Math.floor(selectedCell/9), col = selectedCell%9;
            const cells = document.querySelectorAll('.sudoku-cell');
            if (cells[selectedCell].classList.contains('prefilled')) return;
            
            currentBoard[row][col] = num;
            updateBoardDisplay();
            checkGameComplete();
        }

        // Limpiar celda
        function clearSelected() {
            if (selectedCell === null || isGameComplete) return;
            const cells = document.querySelectorAll('.sudoku-cell');
            if (cells[selectedCell].classList.contains('prefilled')) return;
            
            const row = Math.floor(selectedCell/9), col = selectedCell%9;
            currentBoard[row][col] = 0;
            updateBoardDisplay();
        }

        // Resolver puzzle
        function solvePuzzle() {
            currentBoard = solutionBoard.map(row => [...row]);
            updateBoardDisplay();
            stopTimer();
            document.getElementById('success-message').style.display = 'block';
            isGameComplete = true;
        }

        // Verificar juego completo
        function checkGameComplete() {
            for (let row = 0; row < 9; row++) {
                for (let col = 0; col < 9; col++) {
                    if (currentBoard[row][col] === 0 || currentBoard[row][col] !== solutionBoard[row][col]) {
                        return false;
                    }
                }
            }
            isGameComplete = true;
            stopTimer();
            document.getElementById('success-message').style.display = 'block';
            return true;
        }

        // Temporizador
        function startTimer() {
            gameStartTime = new Date();
            if (timerInterval) clearInterval(timerInterval);
            timerInterval = setInterval(() => {
                const elapsed = Math.floor((new Date() - gameStartTime) / 1000);
                const mins = Math.floor(elapsed / 60), secs = elapsed % 60;
                document.getElementById('timer').textContent = 
                    `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
            }, 1000);
        }

        function stopTimer() {
            if (timerInterval) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }

        // Modal
        function showInstructions() {
            document.getElementById('instructions-modal').classList.add('show');
            document.body.style.overflow = 'hidden';
        }

        function hideInstructions() {
            document.getElementById('instructions-modal').classList.remove('show');
            document.body.style.overflow = 'auto';
        }

        // Event listeners
        function setupEventListeners() {
            document.getElementById('difficulty').addEventListener('change', generateNewGame);
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') { hideInstructions(); return; }
                if (selectedCell === null || isGameComplete) return;
                if (e.key >= '1' && e.key <= '9') insertNumber(parseInt(e.key));
                else if (e.key === 'Delete' || e.key === 'Backspace') clearSelected();
            });
        }

        // Inicializar al cargar
        document.addEventListener('DOMContentLoaded', initGame);
    