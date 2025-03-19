// Most code referenced from the following sources:
// - Collision Detection: (https://www.geeksforgeeks.org/collision-detection-in-a-2d-game-using-javascript/)
// - Obstacle Class: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
// - End Game Detection and Score Update: (https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_game_with_canvas)

//*******//
// Initialization
//*******//
const CANVAS = document.getElementById('gameCanvas');
const CTX = CANVAS.getContext('2d');
const START_BUTTON = document.getElementById('start-button');
const START_SCREEN = document.getElementById('start-screen');

// Load images
const METEOR_IMG = new Image(); 
METEOR_IMG.src = 'meteor.jpeg';  // Meteor image

const OBSTACLE_IMG = new Image();  
OBSTACLE_IMG.src = 'spacerock.jpeg';  // Obstacle image

const EARTH_IMG = new Image(); 
EARTH_IMG.src = 'earth.jpeg';  // Earth image

const HEART_IMG = new Image();
HEART_IMG.src = 'Adobe Express - file.png';  // Heart image used for lives

// Game state variables
let meteor, obstacles = [], gameInterval, gameRunning = false, score = 0, lives = 3;
let earthSize = 100, earthX;
let hearts = [];  // Array for heart images

// Resize canvas
CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

// Load custom tab symbol for the browser tab
document.title = 'Meteor Rush Game';

// Console log for initial setup
console.log("Canvas set up with dimensions:", CANVAS.width, CANVAS.height);
console.log("Game assets loaded:", METEOR_IMG.src, OBSTACLE_IMG.src, EARTH_IMG.src, HEART_IMG.src);

//*******//
// Collision Detection Function
//*******//
function collisionDetection(meteor, obstacle) {
    // Check if the meteor is within the bounds of the obstacle
    return (
        meteor.x + meteor.size > obstacle.x &&
        meteor.x - meteor.size < obstacle.x + obstacle.width &&
        meteor.y + meteor.size > obstacle.y &&
        meteor.y - meteor.size < obstacle.y + obstacle.height
    );
}

//*******//
// Meteor Class
//*******//
class Meteor {
    constructor() {
        this.x = 50;
        this.y = CANVAS.height / 2;
        this.size = 30;
        this.speed = 5;
        this.dy = 0;
    }

    draw() {
        CTX.drawImage(METEOR_IMG, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    }

    move() {
        this.y += this.dy;

        if (this.y < this.size) this.y = this.size;
        if (this.y > CANVAS.height - this.size) this.y = CANVAS.height - this.size;
    }

    setDirection(dy) {
        this.dy = dy;
    }

    updateSize() {
        this.size = 30 + Math.floor(score / 15) * 2;  // Meteor grows by 2px every 15 points scored
    }
}

//*******//
// Obstacle Class
//*******//
class Obstacle {
    constructor() {
        this.x = CANVAS.width;  // Start off-screen
        this.y = Math.random() * CANVAS.height;  // Random vertical position
        this.width = Math.random() * 50 + 30;  // Random width
        this.height = Math.random() * 50 + 30;  // Random height
        this.speed = Math.random() * 4 + 3;  // Random speed
    }

    draw() {
        CTX.drawImage(OBSTACLE_IMG, this.x, this.y, this.width, this.height); 
    }

    move() {
        this.x -= this.speed;  // Moves obstacle leftward
    }
}

//*******//
// Start Button Functionality
//*******//
START_BUTTON.addEventListener('click', () => {
    START_SCREEN.style.display = 'none';
    document.querySelector('.title').style.display = 'none';
    gameRunning = true;
    meteor = new Meteor();
    obstacles = [];
    score = 0;
    lives = 3;  // Reset lives
    earthSize = 100;
    earthX = CANVAS.width - 200;
    hearts = [];  // Reset hearts array
    startGame();
});

//*******//
// End Game Function
//*******//
function endGame(message) {
    clearInterval(gameInterval);
    gameRunning = false;
    alert(message);
    START_SCREEN.style.display = 'block';
}

//*******//
// Game Loop Function
//*******//
function startGame() {
    if (!gameRunning) return;

    gameInterval = setInterval(() => {
        CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);  // Clears the canvas for the next frame
        
        // Draw meteor
        meteor.updateSize();  // Updates the meteor's size based on score
        meteor.move();
        meteor.draw();

        // Create one obstacle
        if (Math.random() < 0.02) {
            obstacles.push(new Obstacle());
        }

        // Move and draw obstacles
        obstacles.forEach((obstacle, index) => {
            obstacle.move();
            obstacle.draw();

            if (collisionDetection(meteor, obstacle)) {
                lives--;
                score -= 5;
                if (lives <= 0) {
                    endGame('GAME OVER! Your meteor was obliterated by space junk. At least it didn\'t feel a thing. Or did it?');
                }
            }

            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score += 1;
            }
        });

        // Earth appears at score 100
        if (score >= 100) {
            earthX -= 1;
        }

        if (score >= 100) {
            CTX.drawImage(EARTH_IMG, earthX - earthSize, CANVAS.height / 2 - earthSize, earthSize * 2, earthSize * 2); 
        }

        // Display score in a visible location
        CTX.fillStyle = 'white';
        CTX.font = '20px Arial';
        CTX.fillText('Score: ' + score, 50, 30);  // Display score in the top-left corner

        // Display hearts below the score (ensure they don't overlap)
        for (let i = 0; i < lives; i++) {
            CTX.drawImage(HEART_IMG, 10 + i * 40, 50, 30, 30);  // Adjusted y-position to 50
        }

        // End game conditions when reaching Earth
        if (score >= 100 && meteor.x + meteor.size >= earthX) {
            let endingMessage = '';
            if (meteor.size >= 100) {
                endingMessage = 'Congratulations! You caused a **mass extinction event**. Goodbye, Earth. At least you won’t have to deal with taxes anymore.';
            } else if (meteor.size >= 60) {
                endingMessage = 'Boom! You made a **giant crater**. Too bad it was only big enough to bury your hopes and dreams.';
            } else {
                endingMessage = 'Well, that was disappointing. Your meteor **burned up in the atmosphere** like a tiny firework. How quaint.';
            }
            endGame(endingMessage);
        }

    }, 1000 / 60);  // 60 frames per second
}

//*******//
// Meteor Control with Arrow Keys
//*******//
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') {
        meteor.setDirection(-5);
    } else if (event.key === 'ArrowDown') {
        meteor.setDirection(5);
    }
});

document.addEventListener('keyup', () => {
    meteor.setDirection(0);
});
