
# Version History for Meteor Rush

## v0.1 - **Basic skeleton (HTML, canvas, start screen setup)**
- Created the basic structure for the game: `index.html`, basic `canvas` element, start screen, and modal for instructions.
- Set up HTML and CSS foundation for the game.

## v0.2 - **Initial game loop and player movement**
- Implemented the basic game loop using `requestAnimationFrame` for smooth animation.
- Added basic player movement functionality with `Arrow Up` and `Arrow Down` for controlling the player's vertical movement.

## v0.3 - **Add meteor obstacles and collision detection**
- Implemented meteors (obstacles) that appear on the screen at random positions.
- Added collision detection logic between the player and meteors using AABB (Axis-Aligned Bounding Box).
- Reduced player lives when a meteor collides with the player.

## v0.4 - **Implement score and lives system**
- Introduced a score system that increases when the player successfully dodges meteors.
- Added a lives system, where the player loses a life when colliding with a meteor.
- Displayed the score and lives on the screen.

## v0.5 - **Add Earth object and win condition**
- Added an Earth object that appears on the screen after a certain time.
- The player wins the game by reaching Earth (when their character collides with the Earth object).

## v0.6 - **Implement pause/resume functionality**
- Implemented the ability to pause and resume the game using the `P` or `Escape` key.
- Added a pause overlay that shows the message "PAUSED" when the game is paused.

## v0.7 - **Add instructions modal**
- Created a modal that displays the game instructions when the "?" button is clicked.
- Added a close button inside the modal to dismiss the instructions.

## v0.8 - **Add styles for UI and game elements**
- Styled the start screen, buttons, game canvas, and modal elements.
- Applied background animations and designed the user interface to make it visually appealing.

## v1.0 - **Final version - Game working, ready for submission**
- Final testing and debugging.
- All features working properly: Player movement, obstacles, score and lives system, Earth win condition, pause functionality, and instructions modal.
- The game is fully responsive and ready for submission.

---