// Global variables
let gameState = "start";  // Initial game state is 'start'
let meteor;              
let meteorImg;          

function setup() {
  // Create the canvas and set gravity for physics engine
  createCanvas(windowWidth, windowHeight);

  
  // Create the start button and set up the event listener
  let startButton = select('#start-button');
  startButton.mousePressed(startGame);  // When button is pressed, start the game
  
  // Load the meteor image from the file
  meteorImg = loadImage('pngimg.com - meteor_PNG22.png');  

  // Create the meteor sprite at the center of the canvas
  meteor = createSprite(width / 2, height / 2, 50, 50);  
  meteor.addImage(meteorImg); 
  meteor.scale = 0.2;  
}

function draw() {
  background(0);  

  // Check the current game state
  if (gameState === "start") {
    displayStartScreen();  
  } else if (gameState === "playing") {
    playGame();  
  }

  // Draw all sprites on the canvas
  drawSprites();  
}

function displayStartScreen() {
  // Display the game title on the start screen
  textAlign(CENTER, CENTER); 
  fill(255);
  textSize(32);
  text("Meteor Rush", width / 2, height / 3);  // Display title in the center of the screen
}

function startGame() {
  console.log("Start Game button clicked!");

  gameState = "playing";  // Change game state to 'playing'
  
  // Hide the start button and title once the game starts
  let startButton = select('#start-button');
  startButton.hide();  
  
  let title = select('.title');  
  title.hide();  
}

function playGame() {
  // Make the meteor move randomly within a certain range
  meteor.position.x += random(-5, 5); 
  meteor.position.y += random(-5, 5); 
}


