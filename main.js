// Most code referenced from the following sources:
// - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
// - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
// - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)
// Wait for the DOM to load before starting the game
document.addEventListener("DOMContentLoaded", () => {
    
    // **🎮 CANVAS AND DOM ELEMENTS**
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const startButton = document.getElementById("START_BUTTON");
    const startScreen = document.getElementById("start-screen");
    const gameOverScreen = document.getElementById("game-over-screen");
    const restartButton = document.getElementById("RESTART_BUTTON");
    const gameOverText = document.getElementById("game-over-text");

    // **🛠️ GAME SETTINGS**
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    let meteor, obstacles = [], score = 0, lives = 3;
    let gameInterval, gameRunning = false;

    // **🖼️ LOAD GAME IMAGES**
    const meteorImage = new Image();
    meteorImage.src = "meteor.jpeg";
    
    const obstacleImage = new Image();
    obstacleImage.src = "spacerock.jpeg";
    
    const earthImage = new Image();
    earthImage.src = "earth.jpeg";
    
    // **🌑 METEOR CLASS**
    class Meteor {
        constructor() {
            this.x = 100;
            this.y = canvas.height / 2;
            this.size = 80;
            this.dy = 0;
        }

        // Move the meteor based on user input
        move() {
            if (moveUp) this.dy = -4;
            else if (moveDown) this.dy = 4;
            else this.dy = 0;

            // Keep meteor within the canvas bounds
            this.y += this.dy;
            this.y = Math.max(0, Math.min(canvas.height - this.size, this.y));
        }

        // Draw the meteor on the canvas
        draw() {
            ctx.drawImage(meteorImage, this.x, this.y, this.size, this.size);
        }
    }

    // **🪐 OBSTACLE CLASS**
    class Obstacle {
        constructor() {
            this.x = canvas.width;
            this.y = Math.random() * (canvas.height - 50);
            this.width = 50;
            this.height = 50;
            this.speed = Math.random() * 2 + 3;
        }

        // Move the obstacle to the left
        move() {
            this.x -= this.speed;
        }

        // Draw the obstacle on the canvas
        draw() {
            ctx.drawImage(obstacleImage, this.x, this.y, this.width, this.height);
        }
    }

    // **🔁 RESTART GAME**

    // Start the game when the button is clicked
    function startGame() {
        score = 0;
        lives = 3;
        gameRunning = true;
        gameOverScreen.style.display = "none";
        startScreen.style.display = "none";

        meteor = new Meteor();
        obstacles = [];
        gameInterval = setInterval(gameLoop, 1000 / 60);  // Run game at 60 FPS
    }

    // Show the game over screen when the game ends
    function gameOver() {
        clearInterval(gameInterval);
        gameRunning = false;
        gameOverScreen.style.display = "block";
        gameOverText.textContent = `Game Over! Score: ${score}`;
    }

    // **🔄 GAME LOOP (UPDATE & RENDER)**
    function gameLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);  // Clear canvas

        meteor.move();  // Move meteor
        meteor.draw();  // Draw meteor

        // Spawn new obstacles randomly
        if (Math.random() < 0.02) {
            obstacles.push(new Obstacle());
        }

        // Move and draw each obstacle
        obstacles.forEach((obstacle, index) => {
            obstacle.move();
            obstacle.draw();

            // Check for collisions with meteor
            if (meteor.x + meteor.size > obstacle.x && meteor.x < obstacle.x + obstacle.width &&
                meteor.y + meteor.size > obstacle.y && meteor.y < obstacle.y + obstacle.height) {
                lives--;
                obstacles.splice(index, 1);
                if (lives <= 0) gameOver();
            }

            // Remove obstacles that are off-screen
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
            }
        });

        // Display score on the screen
        ctx.font = "30px Arial";
        ctx.fillText(`Score: ${score}`, 10, 30);

        // Increase score if meteor passes Earth
        if (meteor.x > canvas.width - 200) {
            score += 10;
        }
    }

    // **🎮 EVENT LISTENERS**
    
    // Restart the game when the restart button is clicked
    restartButton.addEventListener("click", startGame);

    // Control meteor movement using arrow keys
    let moveUp = false, moveDown = false;
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") moveUp = true;
        if (e.key === "ArrowDown") moveDown = true;
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") moveUp = false;
        if (e.key === "ArrowDown") moveDown = false;
    });

    // Start game when the start button is clicked
    startButton.addEventListener("click", startGame);
});
