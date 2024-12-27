class Brain {
  constructor() {
    // Weights for how we rank each factor when determining the best combo
    this.weights = {
      linesCleared: 0,  // Higher is better
      filledCells: 80,  // Lower is better
      holes: 20,  // Lower is better
      bumpiness: 1,  // Lower is better
      closeness: 10,  // Higher is better
      distanceToEdge: 37,  // Lower is better
      almostCompletedLines: 60,
      smallIslands: 30,
    };

    // Initialize a static cache shared across all Brain instances
    if (!Brain.cache) {
      Brain.cache = new Map();
    }
  }

  /**
   * Serializes the grid into a unique string key.
   * Assumes that grid.grid is an array of GridBlock objects with x, y, filled, and color properties.
   *
   * @param {Grid} grid - The grid to serialize.
   * @returns {string} - The serialized grid string.
   */
  serializeGrid(grid) {
    // Create a binary string where each cell is '1' if filled, '0' otherwise
    // Further optimization can include color encoding if necessary
    return grid.grid.map(block => block.filled ? '1' : '0').join('');
  }


  /**
   * Returns the best combination for a given grid state based on fitness.
   * Utilizes caching to avoid redundant computations.
   *
   * @param {Grid} grid
   * @param {Object} shape1 - { color, positions: [[dx, dy], ...], ... }
   * @param {Object} shape2
   * @param {Object} shape3
   * @returns {Combination|number} The best Combination object or 0 if no combos exist.
   */
  findBestCombination(grid, shape1, shape2, shape3) {
    console.log("Finding best combination...");

    // Generate all possible combinations
    const allCombinations = this.getAllPossibleCombinations(grid, shape1, shape2, shape3);
    console.log(`Total Combinations Generated: ${allCombinations.length}`);

    if (allCombinations.length === 0) {
      return 0; // No valid combinations found
    }

    // Find the combination with the highest fitness
    let bestCombo = allCombinations[0];
    for (let i = 1; i < allCombinations.length; i++) {
      if (allCombinations[i].fitness > bestCombo.fitness) {
        bestCombo = allCombinations[i];
      }
    }

    return bestCombo;
  }

  /**
   * Generates all possible combinations by permuting the shape placement order.
   *
   * @param {Grid} grid
   * @param {Object} shape1
   * @param {Object} shape2
   * @param {Object} shape3
   * @returns {Array<Combination>}
   */
  getAllPossibleCombinations(grid, shape1, shape2, shape3) {
    // 1) Create an array of shape objects with their indices
    const shapeObjs = [
      {shape: shape1, index: 0},
      {shape: shape2, index: 1},
      {shape: shape3, index: 2}
    ];

    // 2) Generate all permutations of the shapes
    const permutations = this.getPermutations(shapeObjs);

    // 3) Collect all combinations from all permutations
    const allCombinations = [];

    for (let perm of permutations) {
      // perm is an array like [ {shape: shape2, index:1}, {shape: shape3, index:2}, {shape: shape1, index:0} ]
      const combosFromOneOrder = this.getAllCombosInSingleOrder(grid, perm[0], perm[1], perm[2]);

      // Process each combination
      for (let combo of combosFromOneOrder) {
        let deadPosition = false;
        // Clone the grid to apply the combination
        const tempGrid = this.cloneGrid(grid);

        for (let position of combo.shapePositions) {  // Ensure that the combo has positions that won't get it killed
          if (position.length === 0) {
            deadPosition = true;
          }
        }

        if (!deadPosition) {
          // Apply the combination shapes in the specified order
          for (let i = 0; i < 3; i++) {
            const shapeIndex = combo.shapeOrder[i];
            const positions = combo.shapePositions[shapeIndex];
            const color = combo.shapeColors[shapeIndex];

            // Place the shape
            tempGrid.playPosition(positions, color);

            // Clear lines/columns
            tempGrid.clearRowsAndColumns();
          }

          // Serialize the final grid state
          const serializedFinalGrid = this.serializeGrid(tempGrid);

          // Check if this grid state has already been processed
          if (Brain.cache.has(serializedFinalGrid)) {
            // Skip this combination as the final grid state is already known
            continue;
          }

          // Calculate fitness for this combination
          this.calculateCombinationFitness(combo, grid);

          // Add the combination to allCombinations
          allCombinations.push(combo);

          // Cache the final grid state
          Brain.cache.set(serializedFinalGrid, combo.fitness);
        }
      }
        }

    return allCombinations;
  }

  /**
   * Recursively generates all combinations for a single permutation order.
   *
   * @param {Grid} grid
   * @param {Object} shapeObjA - { shape, index }
   * @param {Object} shapeObjB
   * @param {Object} shapeObjC
   * @returns {Array<Combination>}
   */
  getAllCombosInSingleOrder(grid, shapeObjA, shapeObjB, shapeObjC) {
    const combosForThisOrder = [];

    // Extract shape objects
    const shapeA = shapeObjA.shape;
    const shapeB = shapeObjB.shape;
    const shapeC = shapeObjC.shape;

    // Initialize placement arrays
    shapeA.placement = [];
    shapeB.placement = [];
    shapeC.placement = [];

    // Array to iterate through shapes in this order
    const shapeObjsArr = [shapeObjA, shapeObjB, shapeObjC];

    /**
     * Recursive helper to place shapes one by one.
     *
     * @param {number} index - Current shape index in shapeObjsArr.
     * @param {Grid} currentGrid - Current state of the grid.
     */
    const placeShape = (index, currentGrid) => {
      // Base case: all shapes placed
      if (index === 3) {
        // Prepare parallel arrays
        const positions = [];
        const colors = [];

        // Assign positions and colors based on original shape indices
        positions[shapeObjA.index] = shapeA.placement.slice();
        positions[shapeObjB.index] = shapeB.placement.slice();
        positions[shapeObjC.index] = shapeC.placement.slice();

        colors[shapeObjA.index] = shapeA.color;
        colors[shapeObjB.index] = shapeB.color;
        colors[shapeObjC.index] = shapeC.color;

        // Shape order array
        const shapeOrder = [shapeObjA.index, shapeObjB.index, shapeObjC.index];

        // Create and store the combination
        const combo = new Combination(positions, colors, shapeOrder);
        combosForThisOrder.push(combo);
        return;
      }

      // Current shape to place
      const currentShapeObj = shapeObjsArr[index];
      const currentShape = currentShapeObj.shape;

      // Find all possible moves for the current shape
      const possibleMoves = this.findPossibleMoves(currentShape, currentGrid);

      // If no moves are possible, record a partial combination
      if (possibleMoves.length === 0) {
        const positions = [];
        const colors = [];

        positions[shapeObjA.index] = shapeA.placement.slice();
        positions[shapeObjB.index] = shapeB.placement.slice();
        positions[shapeObjC.index] = shapeC.placement.slice();

        colors[shapeObjA.index] = shapeA.color;
        colors[shapeObjB.index] = shapeB.color;
        colors[shapeObjC.index] = shapeC.color;

        const shapeOrder = [shapeObjA.index, shapeObjB.index, shapeObjC.index];
        const partialCombo = new Combination(positions, colors, shapeOrder);
        combosForThisOrder.push(partialCombo);
        return;
      }

      // Try placing the current shape in each possible move
      for (let move of possibleMoves) {
        // Clone the grid to isolate this branch
        const newGrid = this.cloneGrid(currentGrid);

        // Place the shape
        newGrid.playPosition(move, currentShape.color);

        // Clear any filled rows/columns
        newGrid.clearRowsAndColumns();

        // Assign the placement
        currentShape.placement = move.slice();

        // Recurse to place the next shape
        placeShape(index + 1, newGrid);

        // Restore the old placement
        currentShape.placement = [];
      }
    };

    // Start recursion with the cloned grid
    const startingGrid = this.cloneGrid(grid);
    placeShape(0, startingGrid);

    // Clean up placement properties
    delete shapeA.placement;
    delete shapeB.placement;
    delete shapeC.placement;

    return combosForThisOrder;
  }

  /**
   * Calculates and assigns the fitness score for a given combination.
   *
   * @param {Combination} combo
   * @param {Grid} originalGrid
   */
  calculateCombinationFitness(combo, originalGrid) {
    // 1. Clone the original grid to apply the combination
    const tempGrid = this.cloneGrid(originalGrid);

    let linesCleared = 0;

    // 2. Apply the combination shapes in the specified order
    for (let i = 0; i < 3; i++) {
      const shapeIndex = combo.shapeOrder[i];
      const positions = combo.shapePositions[shapeIndex];
      const color = combo.shapeColors[shapeIndex];

      // Place the shape
      tempGrid.playPosition(positions, color);

      // Clear lines/columns and accumulate the count
      linesCleared += tempGrid.clearRowsAndColumns();
    }

    // 3. Measure the final grid state
    const filledCells = this.countFilledCells(tempGrid);
    const holes = this.countHoles(tempGrid);
    const bumpiness = this.measureBumpiness(tempGrid);
    const closeness = this.measureCloseness(tempGrid);
    const distanceToEdge = this.measureDistanceToEdge(tempGrid);
    const almostCompleted = this.countAlmostCompletedLines(tempGrid);
    const smallIslands = this.countSmallIslands(tempGrid);

    // 4. Calculate the fitness score using weighted metrics
    combo.fitness = (this.weights.linesCleared * linesCleared)
      - (this.weights.filledCells * filledCells)
      - (this.weights.holes * holes)
      - (this.weights.bumpiness * bumpiness)
      + (this.weights.closeness * closeness)
      - (this.weights.distanceToEdge * distanceToEdge)
      + (this.weights.almostCompletedLines * (almostCompleted.almostCompletedRows + almostCompleted.almostCompletedCols))
      - (this.weights.smallIslands * smallIslands); // Penalize small islands
  }

  /**
   * Counts the number of filled cells in the grid.
   *
   * @param {Grid} grid
   * @returns {number}
   */
  countFilledCells(grid) {
    return grid.grid.reduce((count, cell) => count + (cell.filled ? 1 : 0), 0);
  }

  /**
   * Counts the number of holes in the grid.
   * A hole is defined as an empty cell with at least one filled cell above it in the same column.
   *
   * @param {Grid} grid - The current state of the grid.
   * @returns {number} - The total number of holes.
   */
  countHoles(grid) {
    const gridSize = grid.gridSize;
    let holeCount = 0;

    // Iterate through each column
    for (let x = 0; x < gridSize; x++) {
      let hasFilledAbove = false;

      // Iterate from top to bottom in the current column
      for (let y = 0; y < gridSize; y++) {
        // Find the block at (x, y)
        const block = grid.grid.find(b => b.x === x && b.y === y);
        if (!block) continue; // Skip if block is undefined

        if (block.filled) {
          hasFilledAbove = true; // Found a filled block above
        } else if (hasFilledAbove) {
          holeCount++; // Empty block with at least one filled block above
        }
      }
    }

    return holeCount;
  }

  /**
   * Measures the bumpiness of the grid.
   * Bumpiness is defined as the sum of absolute differences in column heights between adjacent columns.
   *
   * @param {Grid} grid
   * @returns {number}
   */
  measureBumpiness(grid) {
    const gridSize = grid.gridSize;
    const heights = [];

    // Calculate heights for each column
    for (let x = 0; x < gridSize; x++) {
      let height = 0;
      for (let y = 0; y < gridSize; y++) {
        const block = grid.grid.find(b => b.x === x && b.y === y);
        if (block && block.filled) {
          height = gridSize - y; // Assuming y=0 is top
          break;
        }
      }
      heights.push(height);
    }

    // Calculate bumpiness
    let bumpiness = 0;
    for (let x = 0; x < gridSize - 1; x++) {
      bumpiness += Math.abs(heights[x] - heights[x + 1]);
    }

    return bumpiness;
  }

  /**
   * Measures the closeness of blocks on the grid.
   * Closeness is defined as the ratio of filled cells to the area of their bounding box.
   *
   * @param {Grid} grid
   * @returns {number} Closeness ratio (higher is better)
   */
  measureCloseness(grid) {
    const filledBlocks = grid.grid.filter(b => b.filled);
    if (filledBlocks.length === 0) return 0;

    // Determine the bounding box
    let minX = grid.gridSize, maxX = -1;
    let minY = grid.gridSize, maxY = -1;

    for (const block of filledBlocks) {
      if (block.x < minX) minX = block.x;
      if (block.x > maxX) maxX = block.x;
      if (block.y < minY) minY = block.y;
      if (block.y > maxY) maxY = block.y;
    }

    const boundingWidth = maxX - minX + 1;
    const boundingHeight = maxY - minY + 1;
    const boundingArea = boundingWidth * boundingHeight;

    // Closeness ratio
    const closeness = filledBlocks.length / boundingArea;

    return closeness;
  }

  /**
   * Measures the total minimum distance of all filled blocks to the nearest edge.
   * Lower total distance indicates blocks are closer to the edges.
   *
   * @param {Grid} grid - The current state of the grid.
   * @returns {number} - The total minimum distance to the edges.
   */
  measureDistanceToEdge(grid) {
    const gridSize = grid.gridSize;
    const filledBlocks = grid.grid.filter(block => block.filled);

    if (filledBlocks.length === 0) return 0; // No filled blocks, define as 0 or handle accordingly

    let totalDistance = 0;

    for (const block of filledBlocks) {
      const distanceLeft = block.x;
      const distanceRight = gridSize - 1 - block.x;
      const distanceTop = block.y;
      const distanceBottom = gridSize - 1 - block.y;

      // Calculate the minimum distance to any edge
      const minDistance = Math.min(distanceLeft, distanceRight, distanceTop, distanceBottom);

      totalDistance += minDistance;
    }

    return totalDistance;
  }

  /**
   * Counts the number of almost completed rows and columns.
   * An almost completed line is one that has only 1 or 2 empty blocks.
   *
   * @param {Grid} grid - The current state of the grid.
   * @returns {Object} - An object containing counts for rows and columns.
   */
  countAlmostCompletedLines(grid) {
    const gridSize = grid.gridSize;
    let almostCompletedRows = 0;
    let almostCompletedCols = 0;

    // Helper function to count empty blocks in a line
    const countEmpty = (blocks) => blocks.filter(block => !block.filled).length;

    // Check each row
    for (let y = 0; y < gridSize; y++) {
      const row = grid.grid.filter(block => block.y === y);
      const emptyCount = countEmpty(row);
      if (emptyCount === 1 || emptyCount === 2) {
        almostCompletedRows++;
      }
    }

    // Check each column
    for (let x = 0; x < gridSize; x++) {
      const col = grid.grid.filter(block => block.x === x);
      const emptyCount = countEmpty(col);
      if (emptyCount === 1 || emptyCount === 2) {
        almostCompletedCols++;
      }
    }

    return {
      almostCompletedRows,
      almostCompletedCols
    };
  }

  /**
   * Counts the number of small islands (single or double blocks) in the grid.
   * An island is defined as a group of 1 or 2 connected filled blocks.
   *
   * @param {Grid} grid - The current state of the grid.
   * @returns {number} - The total number of small islands.
   */
  countSmallIslands(grid) {
    const gridSize = grid.gridSize;
    let smallIslandCount = 0;

    // Convert the grid to a 2D array for efficient access
    const gridArray = Array.from({length: gridSize}, () => Array(gridSize).fill(null));
    for (const block of grid.grid) {
      if (
        block.x >= 0 &&
        block.x < gridSize &&
        block.y >= 0 &&
        block.y < gridSize
      ) {
        gridArray[block.x][block.y] = block;
      }
    }

    // Initialize a visited matrix
    const visited = Array.from({length: gridSize}, () => Array(gridSize).fill(false));

    // Define directions for adjacency (up, down, left, right)
    const directions = [
      [0, -1], // Up
      [0, 1],  // Down
      [-1, 0], // Left
      [1, 0],  // Right
    ];

    // Iterate through each cell in the grid
    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const block = gridArray[x][y];

        // Skip if the block is empty or already visited
        if (!block || !block.filled || visited[x][y]) {
          continue;
        }

        // Initialize a queue for BFS
        const queue = [];
        queue.push([x, y]);
        visited[x][y] = true;

        let islandSize = 0;

        while (queue.length > 0) {
          const [currentX, currentY] = queue.shift();
          islandSize++;

          // Early exit if island size exceeds 2
          if (islandSize > 2) {
            break;
          }

          // Explore all adjacent directions
          for (const [dx, dy] of directions) {
            const neighborX = currentX + dx;
            const neighborY = currentY + dy;

            // Check boundaries
            if (
              neighborX >= 0 &&
              neighborX < gridSize &&
              neighborY >= 0 &&
              neighborY < gridSize
            ) {
              const neighborBlock = gridArray[neighborX][neighborY];
              if (
                neighborBlock &&
                neighborBlock.filled &&
                !visited[neighborX][neighborY]
              ) {
                queue.push([neighborX, neighborY]);
                visited[neighborX][neighborY] = true;
              }
            }
          }
        }

        // If the island size is 1 or 2, count it as a small island
        if (islandSize === 1 || islandSize === 2) {
          smallIslandCount++;
        }
      }
    }

    return smallIslandCount;
  }

  /**
   * Returns an array of all valid placements for a given shape on the grid.
   * Each placement is an array of [x, y] coordinates.
   *
   * @param {Object} shape - { color, positions: [[dx, dy], ...], ... }
   * @param {Grid} grid
   * @returns {Array<Array<[number, number]>>}
   */
  findPossibleMoves(shape, grid) {
    const allPositions = [];
    for (let x = 0; x < grid.gridSize; x++) {
      for (let y = 0; y < grid.gridSize; y++) {
        const positions = shape.positions.map(([dx, dy]) => [x + dx, y + dy]);

        // Check if all positions are within bounds and not filled
        const isValid = positions.every(([px, py]) => {
          if (px < 0 || px >= grid.gridSize || py < 0 || py >= grid.gridSize) {
            return false;
          }
          const block = grid.grid.find(b => b.x === px && b.y === py);
          return block && !block.filled;
        });

        if (isValid) {
          allPositions.push(positions);
        }
      }
    }
    return allPositions;
  }

  /**
   * Generates all permutations of an array.
   *
   * @param {Array} arr
   * @returns {Array<Array>}
   */
  getPermutations(arr) {
    if (arr.length <= 1) return [arr];
    const results = [];
    for (let i = 0; i < arr.length; i++) {
      const current = arr[i];
      const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
      const subPerms = this.getPermutations(remaining);
      for (let sp of subPerms) {
        results.push([current, ...sp]);
      }
    }
    return results;
  }

  /**
   * Clones the entire Grid object, copying each GridBlock’s .filled and .color,
   * so we can mutate it in recursion without affecting the original.
   *
   * @param {Grid} originalGrid
   * @returns {Grid}
   */
  cloneGrid(originalGrid) {
    const newGrid = new Grid(
      originalGrid.gridSize,
      originalGrid.cellSize,
      originalGrid.edgePadding,
      originalGrid.topPadding,
      originalGrid.sideLength,
      originalGrid.lineThickness
    );
    for (let i = 0; i < newGrid.grid.length; i++) {
      newGrid.grid[i].filled = originalGrid.grid[i].filled;
      // Deep copy color array to prevent reference issues
      newGrid.grid[i].color = [...originalGrid.grid[i].color];
    }
    return newGrid;
  }
}
