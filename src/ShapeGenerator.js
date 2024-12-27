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
    this.shapes = [this.twobytwo, this.threebythree,
                   this.bigTopRight, this.bigTopLeft, this.bigBottomRight, this.bigBottomLeft,
                   this.smallTopRight, this.smallTopLeft, this.smallBottomRight, this.smallBottomLeft,
                   this.L, this.L90, this.L180, this.L270,
                   this.ReverseL, this.ReverseL90, this.ReverseL180, this.ReverseL270,
                   this.Ix2, this.Ix3, this.Ix4, this.Ix5,
                   this.Hx2, this.Hx3, this.Hx4, this.Hx5,
                   this.Z, this.ReverseZ,
                   this.Z90, this.ReverseZ90,
                   this.T, this.T90, this.T180, this.T270];
  }


  /**
   * Initializes and sets up a variety of predefined shape configurations, each
   * identified by a unique ID. Each shape includes a name, a color (initially null),
   * and an array of coordinate positions representing its structure.
   */
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

    // Big 90degree ones
    this.bigTopRight = {
      name: "Big Top Right",
      color: null,
      positions: [[2, 0], [2, 1], [2, 2], [1, 2], [0, 2]]
    }
    this.bigTopLeft = {
      name: "Big Top Left",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]
    }
    this.bigBottomRight = {
      name: "Big Bottom Right",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [1, 2], [2, 2]]
    }
    this.bigBottomLeft = {
      name: "Big Bottom Left",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [1, 0], [2, 0]]
    }

    // Small 90degree ones
    this.smallTopRight = {
      name: "Small Top Right",
      color: null,
      positions: [[1, 0], [1, 1], [0, 1]]
    }
    this.smallTopLeft = {
      name: "Small Top Left",
      color: null,
      positions: [[0, 0], [0, 1], [1, 1]]
    }
    this.smallBottomRight = {
      name: "Small Bottom Right",
      color: null,
      positions: [[0, 0], [1, 0], [1, 1]]
    }
    this.smallBottomLeft = {
      name: "Small Bottom Left",
      color: null,
      positions: [[0, 0], [0, 1], [1, 0]]
    }

    // Normal L shapes
    this.L = {
      name: "L",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [1, 0]]
    }
    this.L90 = {
      name: "L90",
      color: null,
      positions: [[0, 0], [0, 1], [1, 1], [2, 1]]
    }
    this.L180 = {
      name: "L180",
      color: null,
      positions: [[0, 2], [1, 2], [1, 1], [1, 0]]
    }
    this.L270 = {
      name: "L270",
      color: null,
      positions: [[0, 0], [1, 0], [2, 0], [2, 1]]
    }

    // Reverse L Shapes
    this.ReverseL = {
      name: "Reverse L",
      color: null,
      positions: [[0, 0], [1, 0], [1, 1], [1, 2]]
    }
    this.ReverseL90 = {
      name: "Reverse L90",
      color: null,
      positions: [[0, 0], [0, 1], [1, 0], [2, 0]]
    }
    this.ReverseL180 = {
      name: "Reverse L180",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [1, 2]]
    }
    this.ReverseL270 = {
      name: "Reverse L270",
      color: null,
      positions: [[0, 1], [1, 1], [2, 1], [2, 0]]
    }

    // I pieces
    this.Ix2 = {
      name: "Ix2",
      color: null,
      positions: [[0, 0], [0, 1]]
    }
    this.Ix3 = {
      name: "Ix3",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2]]
    }
    this.Ix4 = {
      name: "Ix4",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [0, 3]]
    }
    this.Ix5 = {
      name: "Ix5",
      color: null,
      positions: [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]]
    }

    // Horizontal Pieces
    this.Hx2 = {
      name: "Hx2",
      color: null,
      positions: [[0, 0], [1, 0]]
    }
    this.Hx3 = {
      name: "Hx3",
      color: null,
      positions: [[0, 0], [1, 0], [2, 0]]
    }
    this.Hx4 = {
      name: "Hx4",
      color: null,
      positions: [[0, 0], [1, 0], [2, 0], [3, 0]]
    }
    this.Hx5 = {
      name: "Hx5",
      color: null,
      positions: [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]]
    }

    // Z pieces
    this.Z = {
      name: "Z",
      color: null,
      positions: [[0, 1], [1, 1], [1, 0], [2, 0]]
    }
    this.ReverseZ = {
      name: "ReverseZ",
      color: null,
      positions: [[0, 0], [1, 0], [1, 1], [2, 1]]
    }

    // Z 90degree pieces
    this.Z90 = {
      name: "Z90",
      color: null,
      positions: [[0, 0], [0, 1], [1, 1], [1, 2]]
    }
    this.ReverseZ90 = {
      name: "ReverseZ90",
      color: null,
      positions: [[1, 0], [1, 1], [0, 1], [0, 2]]
    }

    // T pieces
    this.T = {
      name: "T",
      color: null,
      positions: [[1, 0], [0, 1], [1, 1], [2, 1]]
    }
    this.T90 = {
      name: "T90",
      color: null,
      positions: [[0, 1], [1, 0], [1, 1], [1, 2]]
    }
    this.T180 = {
      name: "T180",
      color: null,
      positions: [[0, 0], [1, 0], [2, 0], [1, 1]]
    }
    this.T270 = {
      name: "T270",
      color: null,
      positions: [[0, 0], [0, 1], [1, 1], [0, 2]]
    }
  }


  /**
   * Selects a random shape from the available shapes and assigns it a random color.
   *
   * @return {Object} A shape object with a randomly selected shape and color.
   */
  getRandomShape() {
    let newShape = { ...this.shapes[Math.floor(Math.random() * this.shapes.length)] };
    newShape.color = this.colors[Math.floor(Math.random() * this.colors.length)];

    return newShape;
  }


  /**
   * Refreshes and retrieves the current set of shapes.
   * This method generates a new set of shapes by calling the `getRandomShape` method three times.
   *
   * @return {Array} An array containing three newly generated shapes.
   */
  refreshCurrentShapes() {
    const shape1 = this.getRandomShape();
    const shape2 = this.getRandomShape();
    const shape3 = this.getRandomShape();
    const shapes = [shape1, shape2, shape3];
    return shapes;
  }
}
