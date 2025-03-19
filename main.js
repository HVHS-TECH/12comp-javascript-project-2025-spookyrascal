// Most code referenced from the following sources:
// - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
// - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
// - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)

//*********//
// 🌍 GAME SETUP
//*********//
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
const START_BUTTON = document.getElementById('start-button');
const START_SCREEN = document.getElementById('start-screen');

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

//*********//
// 🔥 GAME CONSTANTS
//*********//
const EARTH_SCORE = 3;
const OBSTACLE_FREQ = 0.03; // Higher = more obstacles
const HEART_SIZE = 30;
const OBSTACLE_SPEED = 5;

//*********//
// 🖼️ LOAD IMAGES SAFELY
//*********//
const IMAGE_PATHS = {
    METEOR: 'meteor.jpeg',
    OBSTACLE: 'spacerock.jpeg',
    EARTH: 'earth.jpeg',
    HEART: 'Adobe Express - file.png',
    TESLA: 'elon.png',
    ENTERPRISE: 'enterprise.png',
    TEAPOT: 'teapot.png'
};

const IMAGES = {}; // Store loaded images here
let imagesLoaded = 0;
const totalImages = Object.keys(IMAGE_PATHS).length;

// Load images & track when they are ready
for (const key in IMAGE_PATHS) {
    IMAGES[key] = new Image();
    IMAGES[key].src = IMAGE_PATHS[key];
    IMAGES[key].onload = () => {
        imagesLoaded++;
        if (imagesLoaded === totalImages) {
            console.log('✅ All images loaded successfully!');
        }
    };
    IMAGES[key].onerror = () => console.error(`❌ Failed to load image: ${IMAGE_PATHS[key]}`);
}

//*********//
// 🏆 GAME VARIABLES
//*********//
let meteor, obstacles = [], gameInterval, gameRunning = false;
let score = 0, lives = 3, earthX;

//*********//
// ☄️ METEOR CLASS
//*********//
class Meteor {
    constructor() {
        this.x = 100;
        this.y = CANVAS.height / 2;
        this.size = 20;
        this.dy = 0;
    }
    move() {
        this.y += this.dy;
        this.y = Math.max(0, Math.min(CANVAS.height - this.size, this.y));
    }
    // Removed the grow method to stop the meteor from increasing in size
    draw() { CTX.drawImage(IMAGES.METEOR, this.x, this.y, this.size, this.size); }
    setDirection(speed) { this.dy = speed; }
}

//*********//
// 🛰️ OBSTACLE CLASS
//*********//
class Obstacle {
    constructor(image, width, height) {
        this.x = CANVAS.width;
        this.y = Math.random() * (CANVAS.height - height);
        this.width = width;
        this.height = height;
        this.image = image;
    }
    move() { this.x -= OBSTACLE_SPEED; }
    draw() { CTX.drawImage(this.image, this.x, this.y, this.width, this.height); }
}

//*********//
// 🎮 GAME START (Wait for Images)
//*********//
START_BUTTON.addEventListener('click', () => {
    if (imagesLoaded < totalImages) {
        console.warn('⏳ Waiting for all images to load...');
        return;
    }
    startGame();
});

function startGame() {
    START_SCREEN.style.display = 'none'; // Hide the title
    gameRunning = true;
    meteor = new Meteor();
    obstacles = [];
    score = 0;
    lives = 3;
    earthX = CANVAS.width - 200;

    gameInterval = setInterval(updateGame, 1000 / 60);
}

//*********//
// 🔄 GAME LOOP
//*********//
function updateGame() {
    if (!gameRunning) return;
    
    CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
    
    // Move & draw meteor
    meteor.move();
    meteor.draw();

    // Generate obstacles
    if (Math.random() < OBSTACLE_FREQ) {
        obstacles.push(new Obstacle(IMAGES.OBSTACLE, 50, 50));
    }

    // Spawn Easter Egg sprites (Tesla, Enterprise, or Teapot) with lower frequency
    if (score >= EARTH_SCORE - 20 && Math.random() < 0.01) {
        const easterEggs = [IMAGES.TESLA, IMAGES.ENTERPRISE, IMAGES.TEAPOT];
        obstacles.push(new Obstacle(easterEggs[Math.floor(Math.random() * easterEggs.length)], 60, 60));
    }

    // Move & draw obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.move();
        obstacle.draw();

        // Collision Detection
        if (checkCollision(meteor, obstacle)) {
            obstacles.splice(index, 1);
            if (--lives <= 0) endGame('GAME OVER! Your meteor was obliterated.');
        }

        // Remove obstacles off-screen & increase score
        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }
    });

    // Show Earth when near winning
    if (score >= EARTH_SCORE) {
        earthX -= 1;
        CTX.drawImage(IMAGES.EARTH, earthX - 100, CANVAS.height / 2 - 100, 200, 200);
    }

    // Display Score & Lives
    drawHUD();

    // Win Condition
    if (score >= EARTH_SCORE && meteor.x + meteor.size >= earthX) {
        checkWinCondition();
    }
}

//*********//
// 🎯 CHECK COLLISION
//*********//
function checkCollision(m, o) {
    return (
        m.x + m.size > o.x &&
        m.x < o.x + o.width &&
        m.y + m.size > o.y &&
        m.y < o.y + o.height
    );
}

//*********//
// 🏆 CHECK WIN CONDITION
//*********//
function checkWinCondition() {
    let message = 
        (meteor.size >= 60) ? 'You caused a **mass extinction event**!' :
        (meteor.size >= 30) ? 'You made a **giant crater**!' :
        'Your meteor **burned up in the atmosphere**!';
    
    endGame(message);
}

//*********//
// 🎮 END GAME
//*********//
function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    START_SCREEN.style.display = 'flex';
}

//*********//
// 🖥️ DRAW HUD (Score & Lives)
//*********//
function drawHUD() {
    CTX.fillStyle = 'white';
    CTX.font = '20px Arial';
    CTX.fillText(`Score: ${score}`, 50, 30);

    // Show Hearts
    for (let i = 0; i < lives; i++) {
        CTX.drawImage(IMAGES.HEART, 10 + i * 40, 50, HEART_SIZE, HEART_SIZE);
    }
}

//*********//
// ⬆️⬇️ CONTROL METEOR WITH ARROW KEYS
//*********//
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        meteor.setDirection(-4);
    } else if (e.key === 'ArrowDown') {
        meteor.setDirection(4);
    }
});

// When key is released, stop meteor movement
document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        meteor.setDirection(0);
    }
});
