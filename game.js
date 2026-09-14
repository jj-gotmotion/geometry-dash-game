// Game variables
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gameRunning = false;
let score = 0;
let level = 1;

// Player object
const player = {
    x: 50,
    y: canvas.height - 100,
    width: 30,
    height: 30,
    velocityY: 0,
    jumping: false,
    color: '#667eea'
};

// Physics
const gravity = 0.5;
const jumpPower = 12;

// Obstacles array
let obstacles = [];
let obstacleSpeed = 5;

// Generate obstacles
function generateObstacle() {
    const obstacleWidth = 20;
    const obstacleHeight = 40 + Math.random() * 50;
    const obstacle = {
        x: canvas.width,
        y: canvas.height - obstacleHeight - 20,
        width: obstacleWidth,
        height: obstacleHeight,
        color: '#ff6b6b'
    };
    obstacles.push(obstacle);
}

// Start game
function startGame() {
    if (!gameRunning) {
        gameRunning = true;
        score = 0;
        level = 1;
        obstacleSpeed = 5;
        obstacles = [];
        player.velocityY = 0;
        player.y = canvas.height - 100;
        document.getElementById('gameStatus').textContent = 'Game Running!';
        document.getElementById('startBtn').textContent = 'Pause';
        gameLoop();
    } else {
        gameRunning = false;
        document.getElementById('gameStatus').textContent = 'Paused';
        document.getElementById('startBtn').textContent = 'Resume';
    }
}

// Reset game
function resetGame() {
    gameRunning = false;
    score = 0;
    level = 1;
    obstacleSpeed = 5;
    obstacles = [];
    player.velocityY = 0;
    player.y = canvas.height - 100;
    document.getElementById('score').textContent = '0';
    document.getElementById('level').textContent = '1';
    document.getElementById('gameStatus').textContent = 'Press SPACE to Start';
    document.getElementById('startBtn').textContent = 'Start Game';
    draw();
}

// Jump function
function jump() {
    if (gameRunning && !player.jumping) {
        player.velocityY = -jumpPower;
        player.jumping = true;
    }
}

// Update game state
function update() {
    if (!gameRunning) return;

    // Apply gravity
    player.velocityY += gravity;
    player.y += player.velocityY;

    // Ground collision
    if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - player.height - 20;
        player.velocityY = 0;
        player.jumping = false;
    }

    // Move obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].x -= obstacleSpeed;

        // Remove off-screen obstacles and add score
        if (obstacles[i].x + obstacles[i].width < 0) {
            obstacles.splice(i, 1);
            score += 10;
            document.getElementById('score').textContent = score;

            // Increase difficulty
            if (score % 100 === 0) {
                level++;
                obstacleSpeed += 1;
                document.getElementById('level').textContent = level;
            }
            continue;
        }

        // Collision detection
        if (checkCollision(player, obstacles[i])) {
            gameRunning = false;
            document.getElementById('gameStatus').textContent = `Game Over! Final Score: ${score}`;
            document.getElementById('startBtn').textContent = 'Start Game';
        }
    }

    // Generate new obstacles
    if (obstacles.length === 0 || obstacles[obstacles.length - 1].x < canvas.width - 200) {
        generateObstacle();
    }
}

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ground
    ctx.fillStyle = '#90ee90';
    ctx.fillRect(0, canvas.height - 20, canvas.width, 20);

    // Draw ground line
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, canvas.height - 20, canvas.width, 20);

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw player border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(player.x, player.y, player.width, player.height);

    // Draw obstacles
    for (let obstacle of obstacles) {
        ctx.fillStyle = obstacle.color;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);

        // Draw obstacle border
        ctx.strokeStyle = '#c92a2a';
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    }
}

// Game loop
function gameLoop() {
    update();
    draw();

    if (gameRunning) {
        requestAnimationFrame(gameLoop);
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        jump();
    }
});

canvas.addEventListener('click', () => {
    jump();
});

// Initial draw
draw();