class Game {
  constructor(width, height, originX, originY) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.score = 0;

    this.brain = new Brain();
    this.updatedGrid = null;

    // BLOCK STUFF
    this.shapeGenerator = new ShapeGenerator();
    this.blockSize = width/25.2;
    this.paddingAmount = width/320; // Space inbetween blocks

    // Background
    this.edgePadding = width/17;
    this.sideLength = width - 2 * this.edgePadding;
    this.topPadding = height/2 - this.sideLength/2 - (3 * this.edgePadding);
    this.edgeStrokeWeight = width/145;
    this.lineThickness = this.sideLength/230;

    // Grid
    this.gridSize = 7;
    this.cellSize = this.sideLength/this.gridSize; // Size of each cell
    this.grid = new Grid(this.gridSize, this.cellSize, this.edgePadding, this.topPadding, this.sideLength, this.lineThickness);

    this.currentShapes = [];  // The shapes at the bottom of the screen
    // Spawn locations for the blocks at the bottom of the screen
    this.shape1pos = [3 * this.edgePadding, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]
    this.shape2pos = [width/2, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]
    this.shape3pos = [width - 3 * this.edgePadding, 2 * this.sideLength - 3 * this.edgePadding];  // [x, y]

    // Variables to spread the block placement across multiple frames
    this.shapeNumber = 0;
    this.positions = [];
    this.color = [];

    this.currentCombo = 0; // Not a combination of blocks, its the combo that awards more points when you've cleared rows
    this.blocksSinceLastLineCleared = 0;


    /**                  --------  SCORING RULES  --------
     1) For every block placed, the score is incremented by the number of blocks that that block took up.
     2) For every line cleared, the score is incremented by 10
     3) There are combos in block blast, for every row you clear, the combo is incremented by one. If you don't clear a
       row in 3 moves, the combo resets to 0.  The combo adds (10 * combo)  to the score on top of the line clear bonus
     4)

    */
  }

  initialize() {
    game.drawBackground();
    game.drawScore();
    game.currentShapes = game.shapeGenerator.refreshCurrentShapes();
    game.drawCurrentBlocks();  // Blocks at the bottom of the screen
  }


  draw() {
    this.drawBackground();
    this.drawScore();

    let actionCount = (frameCount - 1) % 5;  // Used to spread each block's placement across multiple frames

    console.log(actionCount);


    if (frameCount === 1) {  // On the first frame of the game, we need to find the best combo for the starting shapes
      game.bestCombo = game.brain.findBestCombination(game.grid, game.currentShapes[0], game.currentShapes[1], game.currentShapes[2]);
    }

    if (actionCount <= 2) {  // Draw all 3 shapes (action will be 0, 1, then 2)
      if (this.bestCombo === 0) {  // yeah its very very very dead
        noLoop();

        // Blocks on grid and bottom of screen disappeared when game ended so these are here to make it not do that
        this.grid.renderGrid();
        this.drawCurrentBlocks();  // Blocks at the bottom of the screen

        this.drawEndScreen();
        return;
      }

      // Find current shape of the current combination
      this.shapeNumber = this.bestCombo.shapeOrder[actionCount];
      this.positions = this.bestCombo.shapePositions[this.shapeNumber];
      this.color = this.bestCombo.shapeColors[this.shapeNumber];

      // End program when there are no more spaces left
      if (this.positions.length === 0) {
        noLoop();

        // Blocks on grid and bottom of screen disappeared when game ended so these are here to make it not do that
        this.grid.renderGrid();
        this.drawCurrentBlocks();  // Blocks at the bottom of the screen

        this.drawEndScreen();
        return;
      }

      this.grid.playPosition(this.positions, this.color);  // Play the position on the grid

      this.currentShapes[this.shapeNumber] = null;  // Remove the shape from the bottom shown
      const linesCleared = this.grid.clearRowsAndColumns();  // Clear any rows and columns on the grid

      if (this.blocksSinceLastLineCleared === 0) {
        this.currentCombo = 0;
      }

      if (linesCleared !== 0) {
        this.currentCombo += linesCleared;
      } else {
        this.blocksSinceLastLineCleared += 1;
      }

      this.score += this.positions.length;
      this.score += (linesCleared * 10);

      if (linesCleared > 0) {
        this.score += (this.currentCombo * 10);
      }

      this.grid.renderGrid();  // Render out the current state of the grid
      this.drawCurrentBlocks();  // Blocks at the bottom of the screen

    } else if (actionCount === 3) {  // Next frame refresh the current shapes
        this.currentShapes = this.shapeGenerator.refreshCurrentShapes();

    } else if (actionCount === 4) {  // Next frame get the best combination
      this.bestCombo = this.brain.findBestCombination(this.grid, this.currentShapes[0], this.currentShapes[1], this.currentShapes[2]);
    }

    // Always render the grid and draw the current blocks at the end of the frame
    this.grid.renderGrid();
    this.drawCurrentBlocks();  // Blocks at the bottom of the screen
    this.drawCurrentCombo();
  }


  drawCurrentBlocks() {
    const scale = this.blockSize + this.paddingAmount;
    let blockBorderWeight = width/500;

    // Iterate over all of the current shapes (the ones at the bottom of the screen)
    for (let i = 0; i < this.currentShapes.length; i++) {
      let shape = this.currentShapes[i];


      if (shape) {
        let xValues = shape.positions.map(pos => pos[0]);
        let yValues = shape.positions.map(pos => pos[1]);
        let minX = Math.min(...xValues);
        let maxX = Math.max(...xValues);
        let minY = Math.min(...yValues);
        let maxY = Math.max(...yValues);

        let centerX = ((minX + maxX + 1) / 2) * scale;
        let centerY = ((minY + maxY + 1) / 2) * scale;

        // Get spawn positions
        let spawnPos = [this.shape1pos, this.shape2pos, this.shape3pos][i];
        let spawnX = spawnPos[0];
        let spawnY = spawnPos[1];

        // Draw the drop shadows for the shape
        push();
        {
          for (let pos of shape.positions) {
            let rectX = pos[0] * scale - centerX + spawnX;
            let rectY = (maxY - pos[1]) * scale - centerY + spawnY;

            // Drop Shadow
            noStroke();
            fill(52, 63, 122);
            rect(rectX + blockBorderWeight * 5, rectY + blockBorderWeight * 5, this.blockSize, this.blockSize);
          }
        }
        pop();

        // Draw the shape
        push();
        {
          for (let pos of shape.positions) {
            let rectX = pos[0] * scale - centerX + spawnX;
            let rectY = (maxY - pos[1]) * scale - centerY + spawnY;

            stroke(0);
            strokeWeight(blockBorderWeight);
            fill(shape.color);
            rect(rectX, rectY, this.blockSize, this.blockSize);  // Block
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
      textAlign(CENTER);
      textSize(scoreSize);
      fill(255);
      textFont("Square");
      text(`${this.score}`, width/2, scorePadding);
    }
    pop();
  }

  drawEndScreen() {
    let endSize = height/7;
    let endPadding = this.topPadding + this.sideLength/2 + endSize/2;  // Puts the text in the middle of the grid

    push();
    {
      textFont("Square");
      textAlign(CENTER);
      textSize(endSize);
      fill(255);
      strokeWeight(this.lineThickness * 3);
      stroke(0);
      text("DEAD", width/2, endPadding);
    }
    pop();
  }

  drawCurrentCombo() {
    let comboSize = height/30;
    let comboSidePadding = width/6;
    let comboTopPadding = height/26;

    push();
    {
      textAlign(CENTER);
      textSize(comboSize);
      fill(255);
      textFont("Square");
      text("COMBO: " + `${this.currentCombo}`, comboSidePadding, comboTopPadding);
    }
    pop();
  }
}
