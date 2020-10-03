const WINDOW_WIDTH = 600;
const WINDOW_HEIGHT = 800;

function loadBitmap(src) {
  return createImageBitmap(document.getElementById(src));
}

// Object in the game that may be interactable
class GameObject {
  constructor(x, y, w, h, name, img) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;

    this.imageBitmap = img;
    this.visible = true;
  }

  getHitRect() {
    return [this.x, this.y, this.w, this.h];
  }

  click() {
    console.log(this.name + " clicked");
  }

  mousemove() {
    // TODO take mousemove events and show hover tooltip
  }

  draw(context) {
    if (this.visible) {
      context.drawImage(this.imageBitmap, this.x, this.y, this.w, this.h);
    }
  }
}

// Game instance
class Game {
  constructor() {
    this.eventQueue = [];
    
    var container = document.getElementById("container");
    container.style.height = WINDOW_HEIGHT * container.clientWidth / WINDOW_WIDTH;
    this.canvas = document.createElement("canvas");
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.canvas.addEventListener("click", this.onclick.bind(this));
    container.appendChild(this.canvas);

    this.objects = [];

    this.needsDraw = true;

    this.assets = {};
    this.loadingAssets = 0;

    this.loadingAssets = 2;
    this.loadBitmap("resources/floor.bmp").then(this.init.bind(this));
    this.loadBitmap("resources/bed.bmp").then(this.init.bind(this));
  }

  loadBitmap(src) {
    let img = new Image();
    img.src = src;
    this.assets[src] = img;
    return new Promise(r => img.onload=r);
  }

  init() {
    if (--this.loadingAssets > 0) {
      return;
    }

    this.background = this.assets["resources/floor.bmp"];
    this.objects.push(new GameObject(20, 20, 100, 150, "bed", this.assets["resources/bed.bmp"]));

    requestAnimationFrame(this.update.bind(this));
  }

  // Add a click event to the event queue
  onclick(event) {
    this.eventQueue.push(event);
  }

  // Draw the game in its current state
  draw() {
    if (!this.needsDraw) {
      return;
    }

    var context = this.canvas.getContext("2d");
    context.scale(this.canvas.width / WINDOW_WIDTH, this.canvas.height / WINDOW_HEIGHT);

    // Draw background
    var bgWidth = this.background.width;
    var bgHeight = this.background.height;
    for (var x = 0; x + bgWidth < WINDOW_WIDTH; x += bgWidth) {
      for (var y = 0; y + bgHeight < WINDOW_HEIGHT; y += bgHeight) {
        context.drawImage(this.background, x, y, bgWidth, bgHeight);
      }
    }

    // Draw objects
    this.objects.forEach((obj) => { obj.draw(context); });
  }

  // Update game state then draw and request another frame
  update() {
    // Handle events
    while (this.eventQueue.length) {
      var e = this.eventQueue.shift();
      // Handle mouse clicks
      if (e instanceof MouseEvent && e.button == 0) {
        this.objects.forEach((obj) => {
          var [x, y, w, h] = obj.getHitRect();
          if (e.x >= x && e.x < x+w && e.y >= y && e.y < y+h) {
            obj.click();
          }
        });
      }
    }

    // TODO set needsDraw only if necessary
    this.needsDraw = true;
    // Draw and request another frame
    this.draw();
    requestAnimationFrame(this.update.bind(this));
  }
}

onload = () => {
  const game = new Game();
}