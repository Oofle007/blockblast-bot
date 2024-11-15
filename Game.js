class Game {
  constructor(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.score = 0;

    // BLOCK STUFF
    this.shapeGenerator = new ShapeGenerator();
    this.blockSize = 55;
    this.paddingAmount = 4; // Space inbetween blocks

    // Background
    this.edgePadding = width/17;
    this.sideLength = width - 2 * this.edgePadding;
    this.topPadding = height/2 - this.sideLength/2 - (3 * this.edgePadding);
    this.edgeStrokeWeight = width/145;
    this.lineThickness = this.sideLength/230;

    // Grid
    this.gridSize = 8;
    this.cellSize = this.sideLength/this.gridSize; // Size of each cell
    this.grid = new Grid(this.gridSize, this.cellSize, this.edgePadding, this.topPadding, this.sideLength, this.lineThickness);

    this.shape1 = this.shapeGenerator.getRandomShape();
    this.shape2 = this.shapeGenerator.getRandomShape();
    this.shape3 = this.shapeGenerator.getRandomShape();
  }


  draw() {
    this.drawBackground();
    this.drawScore();
    this.grid.renderGrid();
  }

  drawBlockPreview(shape) {
    // Draw the preview of the block on the bottom of the screen
  }


  drawBackground() {
    // everything is proportional to the size of the screen


    push();
    {
      background(63, 77, 131);

      // Draw Rectangle for Grid
      fill(36, 41, 70);
      stroke(49, 58, 98);
      strokeWeight(this.edgeStrokeWeight);
      rect(this.edgePadding, this.topPadding, this.sideLength, this.sideLength);

      // Set Grid line settings
      stroke(31, 36, 60);
      strokeWeight(this.lineThickness); // Set the line thickness

      // Generate the grid lines running along the x-axis
      for (let y = this.topPadding + this.sideLength - this.cellSize; y >= this.topPadding + this.edgePadding; y -= this.cellSize) {
        line(this.edgePadding + this.edgeStrokeWeight, y, this.edgePadding + this.sideLength - this.edgeStrokeWeight, y);
      }

      // Generate the grid lines running along the y-axis
      for (let x = this.edgePadding + this.sideLength - this.cellSize; x >= this.edgePadding + this.edgePadding; x -= this.cellSize) {
        line(x, this.topPadding + this.edgeStrokeWeight, x, this.topPadding + this.sideLength - this.edgeStrokeWeight);
      }

      // Inner border same color as grid lines
      noFill();
      rect(this.edgePadding + this.lineThickness, this.topPadding + this.lineThickness, this.sideLength - 2 * this.lineThickness, this.sideLength - 2 * this.lineThickness);
    }
    pop();
  }


  drawScore() {
    let scorePadding = height/6.5;
    let scoreSize = height/16.5;

    push();
    {
      textFont("Square");
      textAlign(CENTER);
      textSize(scoreSize);
      fill(255);
      text(`${this.score}`, width/2, scorePadding);
    }
    pop();
  }
}
