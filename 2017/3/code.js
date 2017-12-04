// Tom Scallon. Advent of Code 2017, day 3.

// Read in input.
const input = +require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8').trim();

// Part 1 code.
const E = 0;
const N = 1;
const W = 2;
const S = 3;
const DIFFS = {
  [E]: {x:  1, y:  0},
  [N]: {x:  0, y: -1},
  [W]: {x: -1, y:  0},
  [S]: {x:  0, y:  1}
};
const getPos = n => {
  let remaining = n - 1;
  let pos = {x: 0, y: 0};
  let dir = E;
  let extent = 1;
  let updateExtent = false;

  while (remaining > 0) {
    // Update the position.
    const move = Math.min(remaining, extent);
    pos = {
      x: pos.x + move * DIFFS[dir].x,
      y: pos.y + move * DIFFS[dir].y
    };

    // Update remaining.
    remaining -= move;

    // Update direction.
    dir = (dir + 1) % 4;

    // Update the extent if necessary
    if (updateExtent) {
      extent++;
      updateExtent = false;
    } else {
      updateExtent = true;
    }
  }

  return pos;
};

const getDist = ({x: ax, y: ay}, {x: bx, y: by}) =>
  Math.abs(ax - bx) + Math.abs(ay - by);

const p1 = () => getDist({x: 0, y: 0}, getPos(input));

// Part 2 code.
function* posSeq() {
  let extent = 1;
  let remaining = extent;
  let pos = {x: 0, y: 0};
  let dir = E;
  let updateExtent = false;

  // Yield the first position.
  yield pos;

  while (true) {
    // Update the position.
    pos = {
      x: pos.x + DIFFS[dir].x,
      y: pos.y + DIFFS[dir].y
    };

    // Yield the new position.
    yield pos;

    // Update remaining. If it's 0...
    if (--remaining === 0) {
      // Update direction.
      dir = (dir + 1) % 4;

      // Update the extent if necessary
      if (updateExtent) {
        extent++;
        updateExtent = false;
      } else {
        updateExtent = true;
      }

      // Reset remaining.
      remaining = extent;
    }
  }
};


function* adjacent(i, j) {
  for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
      if (x === 0 && y === 0) {
        continue;
      }

      yield [i + x, j + y];
    }
  }
}

const sumAdjacent = (grid, i, j) => {
  let sum = 0;

  for (let [x, y] of adjacent(i, j)) {
    sum += (grid[x] && grid[x][y]) || 0;
  }

  return sum;
};

const compute = (grid, i, j) => {
  if (!grid[i]) {
    grid[i] = {};
  }

  return grid[i][j] = sumAdjacent(grid, i, j);
};

const p2 = () => {
  const grid = {[0]: {[0]: 1}};
  let last = 0;
  const position = posSeq();

  // Ignore the first position.
  position.next();

  for (let {x, y} of position) {
    last = compute(grid, x, y);
    console.log(`computed (${x}, ${y})\tresult: ${last}`)

    if (last > input) break;
  }

  return last;
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
