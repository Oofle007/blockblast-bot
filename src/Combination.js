class Combination {
  constructor(positions, colors, shapeOrder) {
    this.shapePositions = positions;  // e.g. [ [ [x,y], ... ], [ [x,y], ... ], [ [x,y], ... ] ]
    this.shapeColors = colors;        // e.g. [ color0, color1, color2 ]
    this.shapeOrder = shapeOrder;     // e.g. [0,2,1] or [2,0,1], etc.

    this.fitness = null;  // How good a Combination is...
  }
}
