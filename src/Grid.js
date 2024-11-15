class Grid {
  constructor(gridSize, cellSize, edgePadding, topPadding, sideLength, lineThickness) {
    this.gridSize = gridSize;
    this.cellSize = cellSize;

    // from game... need the dimensions of the grid to properly assign canvasX and canvasY along with lineThickness for
    this.edgePadding = edgePadding;
    this.topPadding = topPadding;
    this.sideLength = sideLength;
    this.lineThickness = lineThickness;

    this.grid = [];
    this.generateGrid();
  }


  generateGrid() {
    for (let x = 0; x < this.gridSize; x++) {
      for (let y = 0; y < this.gridSize; y++) {
        // Vals of where the grid block actually is on the canvas
        let canvasX = (this.edgePadding + this.cellSize/2) + (this.cellSize * x);
        let canvasY = (this.topPadding + this.sideLength - this.cellSize/2) - (this.cellSize * y);

        let filled = x % 2;

        this.grid.push(new GridBlock(x, y, canvasX, canvasY, false, "aqua"));
      }
    }
  }


  renderGrid() {
    // Iterate over grid to render them all out
    for (let gridBlock of this.grid) {
      this.drawGridBlock(gridBlock.canvasX, gridBlock.canvasY, this.cellSize - 2 * this.lineThickness, this.cellSize - 2 * this.lineThickness, gridBlock.filled, gridBlock.color);
    }
  }

  drawGridBlock(x, y, w, h, filled, color) {
    if (filled) {
      push();
      {
        noStroke();
        fill(color);
        rect(x - w / 2, y - h / 2, w, h);
      }
      pop();
    }
  }
}
