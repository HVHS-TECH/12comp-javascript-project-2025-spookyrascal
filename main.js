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

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.querySelector('.start-btn');
    const instructionsButton = document.querySelector('.instructions-btn');
    const startScreen = document.querySelector('.start-screen');
    const instructionsModal = document.getElementById('instructions-modal');
    const closeBtn = document.querySelector('.close-btn');
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    let gameStarted = false;

    // Game variables
    let player = { x: 100, y: 100, width: 50, height: 50, speed: 5, dy: 0 };
    let obstacles = [];
    let score = 0;
    let lives = 3;

    // Load player and obstacle images
    const playerImage = new Image();
    playerImage.src = 'meteor.jpeg';  // Replace with the correct path to your player sprite

    const meteorImage = new Image();
    meteorImage.src = 'spacerock.jpeg'; // Replace with the correct path to your meteor sprite

    // Start the game when the button is clicked
    startButton.addEventListener('click', startGame);

    // Show instructions when the instructions button is clicked
    instructionsButton.addEventListener('click', showInstructions);

    // Close instructions modal
    closeBtn.addEventListener('click', closeInstructions);

    // Start the game setup
    function startGame() {
        gameStarted = true;
        startScreen.style.display = 'none';
        canvas.style.display = 'block';
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        score = 0;
        lives = 3;
        obstacles = [];
        player.x = 100;
        player.y = 100;
        gameLoop(); // Start the game loop
    }

    // Show instructions modal
    function showInstructions() {
        instructionsModal.style.display = 'flex';
    }

    // Close instructions modal
    function closeInstructions() {
        instructionsModal.style.display = 'none';
    }

    // Game loop (called every frame)
    function gameLoop() {
        if (!gameStarted) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

        // Draw the player (using sprite image)
        ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);

        // Handle obstacles
        handleObstacles();

        // Handle movement
        handleMovement();

        // Display score and lives
        displayScore();
        displayLives();

        requestAnimationFrame(gameLoop); // Keep the game loop running
    }

    // Handle the player's movement with smooth transitions (only up and down)
    function handleMovement() {
        player.y += player.dy;

        // Limit movement within the canvas
        if (player.y < 0) player.y = 0;
        if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;

        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') player.dy = -player.speed;  // Move up
            if (e.key === 'ArrowDown') player.dy = player.speed; // Move down
        });

        window.addEventListener('keyup', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0; // Stop movement
        });
    }

    // Handle obstacles
    function handleObstacles() {
        if (Math.random() < 0.01) {
            let obstacle = { x: canvas.width, y: Math.random() * canvas.height, width: 50, height: 50 };
            obstacles.push(obstacle);
        }

        // Draw obstacles (using sprite image)
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= 3; // Move obstacle to the left

            // Draw the obstacle
            ctx.drawImage(meteorImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);

            // Check for collisions
            if (isCollision(player, obstacle)) {
                console.log("Player hit an obstacle!");
                loseLife();
                obstacles.splice(index, 1); // Remove the obstacle
            }

            // Remove obstacles that go off-screen
            if (obstacle.x < 0) {
                obstacles.splice(index, 1);
            }
        });
    }

    // Collision detection
    function isCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }

    // Display the score
    function displayScore() {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Score: ${score}`, 20, 30);
    }

    // Display the number of lives
    function displayLives() {
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Lives: ${lives}`, canvas.width - 150, 30);
    }

    // Decrease a life when the player hits an obstacle
    function loseLife() {
        lives--;
        if (lives <= 0) {
            gameOver();
        }
    }

    // End the game when lives run out
    function gameOver() {
        gameStarted = false;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = '50px Arial';
        ctx.fillStyle = 'red';
        ctx.fillText('GAME OVER', canvas.width / 2 - 150, canvas.height / 2);
        ctx.font = '30px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2 - 100, canvas.height / 2 + 50);
    }
});