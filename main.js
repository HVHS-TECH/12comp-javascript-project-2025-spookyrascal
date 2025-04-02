/*
 * References:
 * - p5.js Documentation: https://p5js.org/reference/
 * - loadImage() Function: https://p5js.org/reference/#/p5/loadImage
 * - createButton() Function: https://p5js.org/reference/#/p5/createButton
 * - hide() Function: https://p5js.org/reference/#/p5.Element/hide
 * - frameRate() Function: https://p5js.org/reference/#/p5/frameRate
 * - image() Function: https://p5js.org/reference/#/p5/image
 * - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
 * - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
 * - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)
 */

// =========================
// 1. Image Asset Loading
// =========================

// Image sources for the game
const imageSources = {
    player: 'meteor.jpeg',  // Player image
    heart: 'heart.png',     // Heart image
    obstacle: 'spacerock.jpeg', // Obstacle image (space rock)
    earth: 'earth.jpeg'     // Earth image (goal)
};

const images = {
    player: new Image(),
    obstacle: new Image(),
    earth: new Image(),
    heart: new Image()
};

// Function to load all images
function loadImages() {
    return Promise.all(Object.keys(imageSources).map(key => {
        return new Promise((resolve, reject) => {
            images[key].src = imageSources[key];
            images[key].onload = resolve;
            images[key].onerror = () => reject(`Failed to load ${key} image.`);
        });
    }));
}

// =========================
// 2. Game Variables
// =========================

let canvas, ctx;

// Player Variables
let playerX = 100, playerY = 100, playerWidth = 60, playerHeight = 60;
let playerSpeed = 0.25;

// Game Status Variables
let score = 0, lives = 3;
let gameRunning = false;
let gameOverMessageDisplayed = false;
let earthAppeared = false;

// Obstacles and Hearts
let obstacles = [], hearts = [];
let maxHearts = 2; // Max number of hearts that can spawn

// Earth Variables (Made Bigger)
let earthX = 0, earthY = 0, earthWidth = 150, earthHeight = 150; // Increased Earth size

// Movement and Controls
let movingUp = false, movingDown = false;
let lastTime = 0;

// =========================
// 3. Game Logic Functions
// =========================

// Start Game Logic
function startGame() {
    console.log("Game started!");
    gameRunning = true;
    score = 0;
    lives = 3;
    obstacles = [];
    hearts = [];
    gameOverMessageDisplayed = false;
    earthAppeared = false;
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);
    document.querySelector('.start-screen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';

    gameLoop(0); // Start the game loop
}

// Resize canvas to match window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// =========================
// 4. Game Loop
// =========================

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    updatePlayerMovement(deltaTime);
    drawPlayer();
    handleObstacles();
    handleHearts();
    displayScore();
    displayLives();

    // Trigger Earth appearance after certain score threshold
    if (score >= 20 && !earthAppeared) {
        earthAppeared = true;
        earthX = canvas.width - earthWidth; // Earth starts from the right side
        earthY = Math.random() * (canvas.height - earthHeight); // Random y position
    }

    if (earthAppeared) {
        moveEarth();
    }

    if (lives <= 0 && !gameOverMessageDisplayed) {
        displayGameOver();
    }

    requestAnimationFrame(gameLoop);
}

// =========================
// 5. Player Movement
// =========================

function updatePlayerMovement(deltaTime) {
    if (movingUp) playerY -= playerSpeed * deltaTime;
    if (movingDown) playerY += playerSpeed * deltaTime;

    if (playerY < 0) playerY = 0;
    if (playerY + playerHeight > canvas.height) playerY = canvas.height - playerHeight;
}

// Draw the player on the canvas
function drawPlayer() {
    if (images.player.complete) {
        ctx.drawImage(images.player, playerX, playerY, playerWidth, playerHeight);
    }
}

// =========================
// 6. Obstacles (Randomized Size & Speed)
// =========================

function handleObstacles() {
    // Randomly spawn obstacles
    if (Math.random() < 0.02) {
        let obstacleX = canvas.width;
        let obstacleY = Math.random() * (canvas.height - 60);
        let obstacleWidth = Math.random() * 40 + 30; // Random width
        let obstacleSpeed = Math.random() * 3 + 2;  // Random speed

        obstacles.push({ x: obstacleX, y: obstacleY, width: obstacleWidth, speed: obstacleSpeed });
    }

    // Handle obstacle movement and collisions
    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        obstacle.x -= obstacle.speed; 

        if (images.obstacle.complete) {
            ctx.drawImage(images.obstacle, obstacle.x, obstacle.y, obstacle.width, obstacle.width);
        }

        if (isCollision(playerX, playerY, playerWidth, playerHeight, obstacle.x, obstacle.y, obstacle.width, obstacle.width)) {
            console.log("Player hit an obstacle!");
            loseLife();
            obstacles.splice(i, 1); 
            i--; // Adjust index after removal
        }

        if (obstacle.x < 0) {
            obstacles.splice(i, 1);
            i--; // Adjust index after removal
            score++;
        }
    }
}

// =========================
// 7. Hearts
// =========================

function handleHearts() {
    if (hearts.length < maxHearts && Math.random() < 0.005) {
        let heartX = canvas.width;
        let heartY = Math.random() * (canvas.height - 60);
        hearts.push({ x: heartX, y: heartY });
    }

    hearts.forEach((heart, index) => {
        heart.x -= 2; 
        if (images.heart.complete) {
            ctx.drawImage(images.heart, heart.x, heart.y, 40, 40);
        }

        if (isCollision(playerX, playerY, playerWidth, playerHeight, heart.x, heart.y, 40, 40)) {
            console.log("Player collected a heart!");
            gainLife();
            hearts.splice(index, 1); 
        }

        if (heart.x < 0) {
            hearts.splice(index, 1);
        }
    });
}

// =========================
// 8. Collision Detection
// =========================

function isCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
    return x1 < x2 + w2 &&
           x1 + w1 > x2 &&
           y1 < y2 + h2 &&
           y1 + h1 > y2;
}

// =========================
// 9. Earth Movement
// =========================

function moveEarth() {
    earthX -= 2; 
    if (images.earth.complete) {
        ctx.drawImage(images.earth, earthX, earthY, earthWidth, earthHeight);
    }

    // Check for collision with Earth
    if (isCollision(playerX, playerY, playerWidth, playerHeight, earthX, earthY, earthWidth, earthHeight)) {
        displayGameOver(); // End the game when Earth is reached
    }
}

// =========================
// 10. Display Functions
// =========================

function displayScore() {
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, 10, 30);
}

function displayLives() {
    ctx.fillText(`Lives: ${lives}`, canvas.width - 100, 30);
}

// =========================
// 11. Life Management
// =========================

function loseLife() {
    lives--;
    if (lives <= 0) gameRunning = false;
}

function gainLife() {
    if (lives < 3) lives++;
}

// =========================
// 12. Game Over Logic
// =========================

function displayGameOver() {
    gameOverMessageDisplayed = true;

    // Show the game over modal
    const modal = document.getElementById('game-over-modal');
    const finalScoreElement = document.getElementById('final-score');
    const endingMessageElement = document.getElementById('ending-message');

    finalScoreElement.textContent = `Final Score: ${score}`;

    // Set the appropriate ending message based on the score
    let endingMessage = '';
    if (score < 20) {
        endingMessage = 'You barely made it! Better luck next time!';
    } else if (score < 40) {
        endingMessage = 'You made it! Nice job!';
    } else {
        endingMessage = 'Amazing! You saved the Earth with style!';
    }

    endingMessageElement.textContent = endingMessage;

    // Show the modal
    modal.style.display = 'flex';

    // Restart the game on button click
    const restartBtn = document.getElementById('restart-btn');
    restartBtn.addEventListener('click', () => {
        resetGame(); // Reset the game
        startGame(); // Start a new game
        modal.style.display = 'none'; // Hide the modal
    });
}

// =========================
// 13. Game Reset Function
// =========================

function resetGame() {
    gameRunning = false;
    obstacles = []; // Clear obstacles
    hearts = []; // Clear hearts
    score = 0; // Reset score
    lives = 3; // Reset lives
    earthAppeared = false; // Reset Earth state
    playerX = 100; // Reset player position
    playerY = 100;
    gameOverMessageDisplayed = false; // Hide the game over message
}

// =========================
// 14. Event Listeners
// =========================

loadImages().then(() => {
    document.getElementById('start-btn').addEventListener('click', startGame);
    document.getElementById('instructions-btn').addEventListener('click', () => {
        document.getElementById('instructions-modal').style.display = 'flex';
    });

    document.getElementById('close-btn').addEventListener('click', () => {
        document.getElementById('instructions-modal').style.display = 'none';
    });

    // Add controls for moving player
    window.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowUp') movingUp = true;
        if (event.key === 'ArrowDown') movingDown = true;
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'ArrowUp') movingUp = false;
        if (event.key === 'ArrowDown') movingDown = false;
    });
});

