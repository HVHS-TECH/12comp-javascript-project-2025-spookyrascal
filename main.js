// Most code referenced from the following sources:
// - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
// - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
// - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)

// ********* //
// 🌍 GAME SETUP
// ********* //
document.addEventListener("DOMContentLoaded", () => {
    const CANVAS = document.getElementById("gameCanvas");
    const CTX = CANVAS.getContext("2d");
    const START_BUTTON = document.getElementById("START_BUTTON");
    const START_SCREEN = document.getElementById("start-screen");
    const GAME_OVER_SCREEN = document.getElementById("game-over-screen");
    const GAME_OVER_TEXT = document.getElementById("game-over-text");
    const RESTART_BUTTON = document.getElementById("RESTART_BUTTON");

    CANVAS.width = window.innerWidth;
    CANVAS.height = window.innerHeight;

    // ********* //
    // 🔥 GAME CONSTANTS
    // ********* //
    const EARTH_SCORE = 5;
    const OBSTACLE_FREQ = 0.02;
    const HEART_SIZE = 30;
    const OBSTACLE_SPEED = 4;
    const METEOR_SIZE = 80;
    let easterEggAppeared = true;

    // ********* //
    // 🖼️ LOAD IMAGES SAFELY
    // ********* //
    const IMAGE_PATHS = {
        METEOR: "meteor.jpeg",
        OBSTACLE: "spacerock.jpeg",
        EARTH: "earth.jpeg",
        HEART: "heart.png",
        TESLA: "elon.png",
        ENTERPRISE: "enterprise.png",
        TEAPOT: "teapot.png"
    };

    const IMAGES = {};
    let imagesLoaded = 0;
    const totalImages = Object.keys(IMAGE_PATHS).length;

    for (const key in IMAGE_PATHS) {
        IMAGES[key] = new Image();
        IMAGES[key].src = IMAGE_PATHS[key];
        IMAGES[key].onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                console.log("✅ All images loaded successfully!");
            }
        };
        IMAGES[key].onerror = () => console.error(`❌ Failed to load image: ${IMAGE_PATHS[key]}`);
    }

    // ********* //
    // 🏆 GAME VARIABLES
    // ********* //
    let meteor, obstacles = [], gameInterval, gameRunning = false;
    let score = 0, lives = 3, earthX;
    let moveUp = false, moveDown = false;

    // ********* //
    // ☄️ METEOR CLASS
    // ********* //
    class Meteor {
        constructor() {
            this.x = 100;
            this.y = CANVAS.height / 2;
            this.size = METEOR_SIZE;
            this.dy = 0;
        }
        move() {
            if (moveUp) this.dy = -4;
            else if (moveDown) this.dy = 4;
            else this.dy = 0;

            this.y += this.dy;
            this.y = Math.max(0, Math.min(CANVAS.height - this.size, this.y));
        }
        draw() { CTX.drawImage(IMAGES.METEOR, this.x, this.y, this.size, this.size); }
    }

    // ********* //
    // 🛰️ OBSTACLE CLASS
    // ********* //
    class Obstacle {
        constructor(image) {
            this.width = Math.random() * 40 + 50;
            this.height = Math.random() * 40 + 50;
            this.x = CANVAS.width;
            this.y = Math.random() * (CANVAS.height - this.height);
            this.image = image;
            this.speed = Math.random() * 2 + 3;
            this.angle = 0;
            this.rotation = Math.random() * 0.05 - 0.025;
        }
        move() { this.x -= this.speed; }
        draw() {
            CTX.save();
            CTX.translate(this.x + this.width / 2, this.y + this.height / 2);
            CTX.rotate(this.angle);
            CTX.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
            CTX.restore();
            this.angle += this.rotation;
        }
    }

    // ********* //
    // 🎮 GAME START
    // ********* //
    function startGame() {
        START_SCREEN.style.display = "none";
        GAME_OVER_SCREEN.style.display = "none";
        gameRunning = true;
        meteor = new Meteor();
        obstacles = [];
        score = 0;
        lives = 3;
        earthX = CANVAS.width - 200;

        gameInterval = setInterval(updateGame, 1000 / 60);
    }

    // ********* //
    // 🔄 GAME LOOP
    // ********* //
    function updateGame() {
        if (!gameRunning) return;

        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);

        meteor.move();
        meteor.draw();

        if (Math.random() < OBSTACLE_FREQ) {
            obstacles.push(new Obstacle(IMAGES.OBSTACLE));
        }

        obstacles.forEach((obstacle, index) => {
            obstacle.move();
            obstacle.draw();

            if (checkCollision(meteor, obstacle)) {
                obstacles.splice(index, 1);
                if (--lives <= 0) endGame("GAME OVER! Your meteor was obliterated.");
            }

            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++;
            }
        });

        if (score >= EARTH_SCORE) {
            earthX -= 1;
            CTX.drawImage(IMAGES.EARTH, earthX - 100, CANVAS.height / 2 - 100, 200, 200);
        }

        drawHUD();

        if (score >= EARTH_SCORE && meteor.x + meteor.size >= earthX) {
            endGame("🌍 You reached Earth!");
        }
    }

    // ********* //
    // 🎯 COLLISION DETECTION
    // ********* //
    function checkCollision(m, o) {
        return (
            m.x + m.size > o.x &&
            m.x < o.x + o.width &&
            m.y + m.size > o.y &&
            m.y < o.y + o.height
        );
    }

    // ********* //
    // 🏆 DRAW HUD
    // ********* //
    function drawHUD() {
        CTX.fillStyle = "white";
        CTX.font = "20px Arial";
        CTX.fillText(`Score: ${score}`, 50, 30);
    }

    // ********* //
    // ⬆️⬇️ CONTROL METEOR
    // ********* //
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") moveUp = true;
        else if (e.key === "ArrowDown") moveDown = true;
    });

    document.addEventListener("keyup", (e) => {
        if (e.key === "ArrowUp") moveUp = false;
        else if (e.key === "ArrowDown") moveDown = false;
    });

    // ********* //
    // 🏁 END GAME
    // ********* //
    function endGame(message) {
        gameRunning = false;
        GAME_OVER_TEXT.textContent = message;
        GAME_OVER_SCREEN.style.display = "block";
    }

    // ********* //
    // 🔁 RESTART GAME
    // ********* //
    RESTART_BUTTON.addEventListener("click", startGame);

    // ********* //
    // 🎬 START BUTTON
    // ********* //
    START_BUTTON.addEventListener("click", startGame);
});
