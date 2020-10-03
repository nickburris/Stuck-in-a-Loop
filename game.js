class Game {
  constructor() {
    this.eventQueue = [];
    this.canvas = document.createElement("canvas");
    this.canvas.addEventListener("click", this.onclick.bind(this));
    document.getElementById("container").appendChild(this.canvas);

    this.needsDraw = true;
  }

  // Add a click event to the event queue
  onclick(event) {
    this.eventQueue.push(event);
  }

  // Draw the game in its current state
  draw() {
    // TODO draw stuff
  }

  // Update game state then draw and request another frame
  update() {
    // Handle events
    while (this.eventQueue.length) {
      var e = this.eventQueue.shift();
      if (e instanceof MouseEvent) {
        console.log("x: " + e.x + ", y: " + e.y);
      }
    }

    // Draw and request another frame
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }
}

onload = () => {
  const game = new Game();
  requestAnimationFrame(game.update.bind(game));
}