class Game {
  constructor() {
    this.canvas = document.createElement("canvas");
    document.getElementById("container").appendChild(this.canvas);

    this.needsDraw = true;
  }

  // Draw the game in its current state
  draw() {
    // TODO draw stuff
  }

  // Update game state then draw and request another frame
  update() {
    // TODO game logic

    // Draw and request another frame
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }
}

onload = () => {
  const game = new Game();
  requestAnimationFrame(game.update.bind(game));
}