class ShapeGenerator {
  constructor() {
    this.colors = [[50, 50, 50], [70, 70, 100]];

    this.setShapeIDs();
    this.shapes = [this.twobytwo];

  }


  setShapeIDs() {
    this.twobytwo = {
      name: "2x2",
      color: null,
      positions: [[0, 0], [0, 1], [1, 0], [1, 1]]
    }
  }


  getRandomShape() {
    let newShape = this.shapes[Math.floor(Math.random() * this.shapes.length)];  // Create a new block
    newShape.color = this.colors[Math.floor(Math.random() * this.colors.length)];  // Assign random color

    return newShape;
  }
}
