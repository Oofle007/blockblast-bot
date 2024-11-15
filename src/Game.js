class Game {
  constructor(width, height) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.score = 0;

    // BLOCK STUFF
    this.shapeGenerator = new ShapeGenerator();
    this.blockSize = 14;
    this.paddingAmount = 2; // Space inbetween blocks

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

    this.currentShapes = [this.shapeGenerator.getRandomShape(), this.shapeGenerator.getRandomShape(), this.shapeGenerator.getRandomShape()];  // The shapes at the bottom of the screen

    // Spawn locations for the blocks at the bottom of the screen
    this.shape1pos = [3 * this.edgePadding, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]
    this.shape2pos = [width/2, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]
    this.shape3pos = [width - 3 * this.edgePadding, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]
  }


  draw() {
    this.drawBackground();
    this.drawScore();
    this.grid.renderGrid();

    this.drawCurrentBlocks(this.currentShapes[0], this.shape2pos[0], this.shape2pos[1]);
  }

  drawCurrentBlocks() {
    // Draw the preview of the block on the bottom of the screen

    for (let i = 0; i < this.currentShapes.length; i++) {
      let shape = this.currentShapes[i];

      if (shape) {
        // Calculate the min and max x and y to find the bounding box of the current shape
        let minX = Math.min(...shape.positions.map(pos => pos[0]));
        let maxX = Math.max(...shape.positions.map(pos => pos[0]));
        let minY = Math.min(...shape.positions.map(pos => pos[1]));
        let maxY = Math.max(...shape.positions.map(pos => pos[1]));

        // Calculate the center offset of the current shape
        let centerX = ((minX + maxX + 1) / 2) * (this.blockSize + this.paddingAmount);
        let centerY = ((minY + maxY + 1) / 2) * (this.blockSize + this.paddingAmount);

        // Make sure the current block is drawn in the right area based on where its supposed to be
        let spawnX, spawnY;
        if (i === 0) {
          spawnX = this.shape1pos[0];
          spawnY = this.shape1pos[1];
        } else if (i === 1) {
          spawnX = this.shape2pos[0];
          spawnY = this.shape2pos[1];
        } else {
          spawnX = this.shape3pos[0];
          spawnY = this.shape3pos[1];
        }

        // Draw the current shape
        push();
        {
          fill(shape.color);
          for (let pos of shape.positions) {
            let rectX = pos[0] * (this.blockSize + this.paddingAmount) - centerX + spawnX;
            let rectY = (maxY - pos[1]) * (this.blockSize + this.paddingAmount) - centerY + spawnY;

            rect(rectX, rectY, this.blockSize, this.blockSize);
          }
        }
        pop();
      }
    }
  }


  drawBackground() {
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
