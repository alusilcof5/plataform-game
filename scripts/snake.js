const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
let snake, direction, food, score, level, gameInterval, timeElapsed, timerInterval, speed;

function init() {
    snake = [{x: 9 * box, y: 10 * box}];
    direction = null;
    score = 0;
    level = 1;
    timeElapsed = 0;
    speed = 200;
    food = spawnFood();
    updateScore();
    updateLevel();
    updateTime();
}

function spawnFood() {
    return {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = i === 0 ? "lime" : "green";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }

    
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    
    let headX = snake[0].x;
    let headY = snake[0].y;

    if (direction === "LEFT") headX -= box;
    if (direction === "UP") headY -= box;
    if (direction === "RIGHT") headX += box;
    if (direction === "DOWN") headY += box;

    
    if (headX < 0) headX = canvas.width - box;
    else if (headX >= canvas.width) headX = 0;
    if (headY < 0) headY = canvas.height - box;
    else if (headY >= canvas.height) headY = 0;

    
    if (headX === food.x && headY === food.y) {
        score++;
        updateScore();
        food = spawnFood();

        if (score % 5 === 0) {
            level++;
            updateLevel();
            speed = Math.max(50, speed - 20);
            clearInterval(gameInterval);
            gameInterval = setInterval(draw, speed);
        }
    } else {
        snake.pop();
    }

    let newHead = {x: headX, y: headY};

    
    if (collision(newHead, snake)) {
        gameOver();
        return;
    }

    snake.unshift(newHead);
}

function collision(head, array) {
    return array.some(segment => segment.x === head.x && segment.y === head.y);
}

function startGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
    gameInterval = setInterval(draw, speed);
    timerInterval = setInterval(() => {
        timeElapsed++;
        updateTime();
    }, 1000);
}

function pauseGame() {
    clearInterval(gameInterval);
    clearInterval(timerInterval);
}

function resetGame() {
    pauseGame();
    init();
    startGame();
    closeModal(); 
}

function gameOver() {
    pauseGame();
    document.getElementById("modalMessage").textContent =
        `Puntos: ${score} | Tiempo: ${timeElapsed}s | Nivel: ${level}`;
    document.getElementById("gameOverModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("gameOverModal").style.display = "none";
}

function updateScore() {
    document.getElementById("score").textContent = score;
}
function updateLevel() {
    document.getElementById("level").textContent = level;
}
function updateTime() {
    document.getElementById("time").textContent = timeElapsed;
}

document.addEventListener("keydown", e => {
    e.preventDefault();
    if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
    if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
    if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
    if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

init();
