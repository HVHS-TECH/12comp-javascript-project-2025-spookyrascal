Canvas API
 This is where the canvas context is set up:

 const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
 Reference: MDN - Canvas API


CanvasRenderingContext2D (drawImage)
 Drawing images onto the canvas (e.g., player, meteors, Earth):

 ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);
 Reference: MDN - drawImage()


requestAnimationFrame()
 For looping the game with smooth animations:

 requestAnimationFrame(loop);
 Reference: MDN - requestAnimationFrame


addEventListener() for Keyboard Input
 Handling key presses for player movement and pausing the game:

 document.addEventListener('keydown', e => {
  if (e.key === 'ArrowUp') player.dy = -player.speed;
  if (e.key === 'ArrowDown') player.dy = player.speed;
  if (e.key === 'p' || e.key === 'Escape') togglePause();
});
document.addEventListener('keyup', e => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') player.dy = 0;
});
 Reference: MDN - EventListener


Math.random()
 Used to generate random obstacles:

 if (Math.random() < 0.02) {
  let size = 30 + Math.random() * 40;
}
 Reference: MDN - Math.random()


setTimeout() or Timing Logic
 Showing Earth after 10 seconds:

 let time = (Date.now() - startTime) / 1000;
if (!earth.show && time > 10) earth.show = true;
 Reference: MDN - setTimeout


String Manipulation (for displaying text)
 Displaying score or game-over message:

 ctx.fillText(`Score: ${score}`, 20, 40);
ctx.fillText(`Lives: ${lives}`, canvas.width - 150, 40);
 *Reference: MDN - String


CSS for Modal/Overlay control
 Showing/hiding the instructions and pause overlay:

 instructionsBtn.onclick = () => instructionsModal.style.display = 'flex';
closeBtn.onclick = () => instructionsModal.style.display = 'none';
pauseOverlay.style.display = paused ? 'flex' : 'none';
 *Reference: MDN - CSS Display Property


HTML DOM Selection
 Getting elements from the DOM (e.g., buttons, canvas):

 const startBtn = document.querySelector('.start-btn');
const instructionsBtn = document.querySelector('.instructions-btn');
const instructionsModal = document.getElementById('instructions-modal');
const canvas = document.getElementById('gameCanvas');
 Reference: MDN - getElementById()
 Reference: MDN - querySelector()

