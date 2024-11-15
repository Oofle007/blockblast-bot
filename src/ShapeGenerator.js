class ShapeGenerator {
  constructor() {
    this.colors = [[200, 97, 64], [117, 184, 81], [123, 90, 201], [180, 59, 55], [216, 171, 74], [111, 178, 221], [81, 99, 219]];

    // orange  [200, 97, 64]
    // green  [117, 184, 81]
    // purple  [123, 90, 201]
    // red  [180, 59, 55]
    // yellow  [216, 171, 74]
    // aqua  [111, 178, 221]
    // blue  [81, 99, 219]

    this.setShapeIDs();
    this.shapes = [this.twobytwo, this.threebythree, this.bigTopRight];

  }


  setShapeIDs() {
    this.twobytwo = {
      name: "2x2",
      color: null,
      positions: [[0, 0], [0, 1], [1, 0], [1, 1]]
    }
    this.threebythree = {
      name: "3x3",
      color: null,
      positions: [[0, 0] , [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]]
    }
    this.bigTopRight = {
      name: "Big Top Right",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [-1, 2], [-2, 2]]
    }
  }


  getRandomShape() {
    let newShape = { ...this.shapes[Math.floor(Math.random() * this.shapes.length)] };
    newShape.color = this.colors[Math.floor(Math.random() * this.colors.length)];

    return newShape;
  }
}
