let gameState = "start";  // Initialize the game state
let meteor;

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Create the start button and attach the mousePressed event
  let startButton = select('#start-button');
  startButton.mousePressed(startGame);

  // Create the meteor sprite
  meteor = createSprite(width / 2, height / 2, 50, 50);
  meteor.shapeColor = color(255, 150, 0);
  meteorImg 
}

function draw() {
  background(0);  // Clear the background

  if (gameState === "start") {
    displayStartScreen();  // Display the start screen if the game state is 'start'
  } else if (gameState === "playing") {
    playGame();  // Start the game when the game state is 'playing'
  }
}

function displayStartScreen() {

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(32);
  text("Meteor Rush", width / 2, height / 3);
}

function startGame() {
    console.log("Start Game button clicked!");
  
    // Change the game state to 'playing'
    gameState = "playing";
  
    // Hide the start button
    let startButton = select('#start-button');
    startButton.hide();

    let title = select('.title');  
    title.hide(); 
  }  

function playGame() {
  meteor.position.x += random(-5, 5);
  meteor.position.y += random(-5, 5);

  drawSprites();  
}

