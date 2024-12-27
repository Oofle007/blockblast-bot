class Grid {
  constructor(gridSize, cellSize, edgePadding, topPadding, sideLength, lineThickness) {
    this.gridSize = gridSize;
    this.cellSize = cellSize;

    // from game... need the dimensions of the grid to properly assign canvasX, canvasY
    this.edgePadding = edgePadding;
    this.topPadding = topPadding;
    this.sideLength = sideLength;
    this.lineThickness = lineThickness;

    this.grid = [];
    this.generateGrid();
  }

  /**
   * Generates a grid based on the current grid size and adds GridBlocks to the grid array
   * with their respective positions on the canvas.
   */
  generateGrid() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        let canvasX = (this.edgePadding + this.cellSize / 2) + (this.cellSize * x);
        let canvasY = (this.topPadding + this.sideLength - this.cellSize / 2) - (this.cellSize * y);
        this.grid.push(new GridBlock(x, y, canvasX, canvasY, false, [0, 255, 255]));
      }
    }
  }

  /**
   * Places a shape’s blocks on the grid by marking their positions as filled.
   * (Formerly in Brain, now moved here.)
   *
   * @param {Array<Array<number>>} positions - Array of [x, y] coords to fill.
   * @param {string | Array<number>} [color] - Optional color to fill with.
   */
  playPosition(positions, color) {
    for (let [x, y] of positions) {
      let block = this.grid.find(b => b.x === x && b.y === y);
      if (block) {
        block.filled = true;
        if (color) {
          block.color = color;
        }
      }
    }
  }

  /**
   * Renders the grid by iterating through each GridBlock and drawing it on the canvas.
   */
  renderGrid() {
    for (let gridBlock of this.grid) {
      this.drawGridBlock(
        gridBlock.canvasX,
        gridBlock.canvasY,
        this.cellSize - 2 * this.lineThickness,
        this.cellSize - 2 * this.lineThickness,
        gridBlock.filled,
        gridBlock.color,
        this.cellSize / 8,
        true
      );
    }
  }

  /**
   * Draws a grid block at a specified location with given dimensions and optional 3D trapezoids.
   */
  drawGridBlock(x, y, w, h, filled, baseColor, insetDistance, shading) {
    // 1) Draw the main square
    if (filled) {
      push();
      noStroke();
      fill(baseColor[0], baseColor[1], baseColor[2]);
      rect(x - w / 2, y - h / 2, w, h);
      pop();
    }

    if (filled) {  // Only shade on filled blocks
      // 2) Prepare colors for trapezoids (if shading is enabled)
      let colors;
      if (shading) {
        // Different multipliers for each side to simulate light/shadow
        colors = [
          baseColor.map(c => constrain(c * 0.8, 0, 255)), // Top (darker)
          baseColor.map(c => constrain(c * 1.2, 0, 255)), // Right (brighter)
          baseColor.map(c => constrain(c * 0.6, 0, 255)), // Bottom (darkest)
          baseColor.map(c => constrain(c * 1.0, 0, 255)), // Left (same as base)
        ];
      } else {
        // All trapezoids use the same color as the square
        colors = [baseColor, baseColor, baseColor, baseColor];
      }

      // 3) Coordinates of the square’s corners
      //    in clockwise or counterclockwise order
      let corners = [
        [x - w / 2, y - h / 2], // Top-left
        [x + w / 2, y - h / 2], // Top-right
        [x + w / 2, y + h / 2], // Bottom-right
        [x - w / 2, y + h / 2], // Bottom-left
      ];

      // 4) Draw four trapezoids
      for (let i = 0; i < 4; i++) {
        let c1 = corners[i];
        let c2 = corners[(i + 1) % 4];

        // Fraction of how far to "push" each corner toward the center (x, y)
        // You can tune this logic if you want different insets per side.
        let fraction = insetDistance / (w / 2);

        // Move each corner toward the center to form the short side of the trapezoid
        let c1InsetX = lerp(c1[0], x, fraction);
        let c1InsetY = lerp(c1[1], y, fraction);
        let c2InsetX = lerp(c2[0], x, fraction);
        let c2InsetY = lerp(c2[1], y, fraction);

        // Draw the trapezoid
        push();
        noStroke();
        fill(colors[i][0], colors[i][1], colors[i][2]);
        quad(
          c1[0], c1[1],     // corner 1 of square
          c2[0], c2[1],     // corner 2 of square
          c2InsetX, c2InsetY, // corner 2 moved inward
          c1InsetX, c1InsetY  // corner 1 moved inward
        );
        pop();
      }
    }
  }


  /**
   * Clears fully filled rows and columns from the grid by resetting the `filled` property
   * of affected cells to false and changing their color to the default cleared state.
   *
   * The method identifies rows and columns that are completely filled with cells marked as `filled`,
   * and then iterates through the grid to reset these cells. The cleared rows and columns
   * contribute to the total count which is returned.
   *
   * @return {number} The total number of rows and columns that were cleared.
   */
  clearRowsAndColumns() {
    const fullRows = [];
    const fullCols = [];

    // 1. Identify fully filled rows and columns
    for (let i = 0; i < this.gridSize; i++) {
      const rowCells = this.grid.filter(cell => cell.y === i);
      const colCells = this.grid.filter(cell => cell.x === i);

      if (rowCells.length === this.gridSize && rowCells.every(cell => cell.filled)) {
        fullRows.push(i);
      }
      if (colCells.length === this.gridSize && colCells.every(cell => cell.filled)) {
        fullCols.push(i);
      }
    }

    // 2. Clear those rows/columns
    for (let cell of this.grid) {
      if (fullRows.includes(cell.y) || fullCols.includes(cell.x)) {
        cell.filled = false;
        cell.color = [0, 255, 255]; // your default or cleared color
      }
    }

    // 3. Return how many rows + columns got cleared
    return fullRows.length + fullCols.length;
  }
}

