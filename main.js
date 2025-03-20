// Most code referenced from the following sources:
// - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
// - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
// - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)

// ********* //
// 🌍 GAME SETUP
// ********* //
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
const START_BUTTON = document.getElementById('START_BUTTON'); 
const START_SCREEN = document.getElementById('start-screen');

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

// ********* //
// 🔥 GAME CONSTANTS
// ********* //
const EARTH_SCORE = 10;
const OBSTACLE_FREQ = 0.02; // Less frequent obstacles
const HEART_SIZE = 30;
const OBSTACLE_SPEED = 4; 
const METEOR_SIZE = 80;  // Increased meteor size
let easterEggAppeared = false;

// ********* //
// 🖼️ LOAD IMAGES SAFELY
// ********* //
const IMAGE_PATHS = {
    METEOR: 'meteor.jpeg',
    OBSTACLE1: 'spacerock.jpeg',
    EARTH: 'earth.jpeg',
    HEART: 'heart.png',
    TESLA: 'elon.png',
    ENTERPRISE: 'enterprise.png',
    TEAPOT: 'teapot.png'
};

const IMAGES = {};
let imagesLoaded = 0;
const totalImages = Object.keys(IMAGE_PATHS).length;

for (const key in IMAGE_PATHS) {
    IMAGES[key] = new Image();
    IMAGES[key].src = IMAGE_PATHS[key];
    IMAGES[key].onload = () => {
        imagesLoaded++;
    };
}

// ********* //
// 🏆 GAME VARIABLES
// ********* //
let meteor, obstacles = [], gameInterval, gameRunning = false;
let score = 0, lives = 3, earthX;
let movingUp = false, movingDown = false;

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
        if (movingUp) this.dy = -5;
        else if (movingDown) this.dy = 5;
        else this.dy = 0;
        
        this.y += this.dy;
        this.y = Math.max(0, Math.min(CANVAS.height - this.size, this.y));
    }
    draw() {
        CTX.drawImage(IMAGES.METEOR, this.x, this.y, this.size, this.size);
    }
}

// ********* //
// 🛰️ OBSTACLE CLASS
// ********* //
class Obstacle {
    constructor(image) {
        this.x = CANVAS.width;
        this.y = Math.random() * (CANVAS.height - 80);
        this.width = Math.random() * 40 + 60;
        this.height = this.width;
        this.image = image;
        this.speed = Math.random() * 2 + 3; // Smooth speed variation
        this.rotation = Math.random() * 0.05 - 0.025; // More subtle rotation
        this.angle = 0;
    }
    move() {
        this.x -= this.speed;
    }
    draw() {
        CTX.save();
        CTX.translate(this.x + this.width / 2, this.y + this.height / 2);
        CTX.rotate(this.angle);
        CTX.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        CTX.restore();
    }
}

// ********* //
// 🎮 GAME START
// ********* //
START_BUTTON.addEventListener('click', () => {
    if (imagesLoaded < totalImages) {
        console.warn('⏳ Waiting for all images to load...');
        return;
    }
    startGame();
});

function startGame() {
    START_SCREEN.style.display = 'none'; // Hide title screen
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

    // Move & draw meteor
    meteor.move();
    meteor.draw();

    // Generate obstacles
    if (Math.random() < OBSTACLE_FREQ) {
        let image = Math.random() > 0.5 ? IMAGES.OBSTACLE1 : IMAGES.OBSTACLE2;
        obstacles.push(new Obstacle(image));
    }

    // Move & draw obstacles
    obstacles.forEach((obstacle, index) => {
        obstacle.move();
        obstacle.angle += obstacle.rotation;
        obstacle.draw();

        if (checkCollision(meteor, obstacle)) {
            obstacles.splice(index, 1);
            if (--lives <= 0) endGame('GAME OVER! Your meteor was obliterated.');
        }

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

    if (score >= EARTH_SCORE && meteor.x + meteor.size >= earthX) {
        checkWinCondition();
    }
}

// ********* //
// 🎯 CHECK COLLISION
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
// 🏆 CHECK WIN CONDITION
// ********* //
function checkWinCondition() {
    let message = 
        (meteor.size >= 80) ? 'You caused a **mass extinction event**!' :
        (meteor.size >= 40) ? 'You made a **giant crater**!' :
        'Your meteor **burned up in the atmosphere**!';
    
    endGame(message);
}

// ********* //
// 🎮 END GAME
// ********* //
function endGame(message) {
    clearInterval(gameInterval);
    alert(message);
    START_SCREEN.style.display = 'flex';
    gameRunning = false;
}

// ********* //
// 🖥️ DRAW HUD (Score & Lives)
// ********* //
function drawHUD() {
    CTX.fillStyle = 'white';
    CTX.font = '20px Orbitron';
    CTX.fillText(`Score: ${score}`, 50, 30);

    for (let i = 0; i < lives; i++) {
        CTX.drawImage(IMAGES.HEART, 10 + i * 40, 50, HEART_SIZE, HEART_SIZE);
    }
}

// ********* //
// ⬆️⬇️ CONTROL METEOR WITH ARROW KEYS
// ********* //
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') movingUp = true;
    if (e.key === 'ArrowDown') movingDown = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') movingUp = false;
    if (e.key === 'ArrowDown') movingDown = false;
});
