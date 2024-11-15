// Variables to make display scalable
const size = 5;  // Multiplier for how big the screen is
const uheight = 146.6, uwidth = 70.6;  // Aspect ratio
const height = uheight * size, width = uwidth * size;

let game = new Game(width, height);

function preload() {
  font = loadFont("../fonts/Square.ttf")
}

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("canvas");
}


function draw() {
  game.draw();

  if (mouseIsPressed) {
    game.score++;
  }


}
