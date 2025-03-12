let rocket; // Declare a variable for the rocket sprite
let backgroundSprite; // Declare a variable for the background sprite

function setup() {
  createCanvas(800, 600); // Set the canvas size

  // Create a background sprite where the rocket can sit
  backgroundSprite = createSprite(width / 2, height / 2, 200, 200); // Adjust size and position

  // Load the rocket sprite and add it to the background sprite
  rocket = createSprite(width / 2, height / 2);
  rocket.addImage(loadImage('rocket.png')); 

  rocket.visible = false;
}

function draw() {
  background(200);
  drawSprites();
}
document.addEventListener('keydown', function(event) {
  if (event.key === 'Enter') {
    startGame(); 
  }
});

function startGame() {
  // Start your game logic here
  console.log('Game started!');
  rocket.visible = true;
  rocket.velocity.x = 5; 
