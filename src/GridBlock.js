class GridBlock {
  constructor(x, y, canvasX, canvasY, filled, color) {
    this.x = x;
    this.y = y;

    // the actual coords of this block on the canvas
    this.canvasX = canvasX;
    this.canvasY = canvasY;

    this.filled = filled;
    this.color = color;
  }
}
