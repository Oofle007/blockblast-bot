// Variables to make display scalable
const gameSize = 5;  // Multiplier for how big the screen is
const uheight = 146.6, uwidth = 70.6;  // Aspect ratio


const height = uheight * gameSize, width = uwidth * gameSize;
// RUN MULTIPLE GAMES
let numRows = 3;  // Number of rows of games
let numCols = 3;  // Number of columns of games

let game = new Game(width, height);

function preload() {
  font = loadFont("../fonts/Square.ttf");
}

function setup() {
  let canvas = createCanvas(width, height);
  canvas.parent("canvas");
  frameRate(30);
  game.initialize();
}

function draw() {
  game.draw();
}
