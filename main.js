/*******************************************************/
// Global Variables
/*******************************************************/
let gameState = "start"; 
let remmy;  

/*******************************************************/
// setup()
/*******************************************************/
function setup() {
	console.log("setup: ");
	createCanvas(windowWidth, windowHeight);

  let startButton = select('#start-button');
  if (startButton) {
    startButton.mousePressed(startGame);

  remmy = new Sprite(200, 150, 100, 100,'d');
  remmy.shapeColor = 'yellow';
  remmy.rotationSpeed = 18;
	remmy.vel.x = -2;
  background('black');
}
/*******************************************************/
// draw()
/*******************************************************/
function draw() {

  // Check the current game state
  if (gameState === "start") {
    displayStartScreen();  
  } else if (gameState === "playing") {
    playGame();  
  }

  drawSprites(); 
}
/*******************************************************/
// startGame()
/*******************************************************/
function startGame() {
  console.log("Start Game button clicked!");
  gameState = "playing";  // Change game state to 'playing'
  
  let startButton = select('#start-button');
  if (startButton) {
    startButton.hide();  
  }

  let title = select('.title');  
  if (title) {
    title.hide();
  }
}