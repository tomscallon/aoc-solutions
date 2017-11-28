// Tom Scallon. Advent of Code 2015, day 6.

// Read in input.
const parseInstruction = text => {
  const [, action, sx, sy, ex, ey] =
    /(turn on|toggle|turn off) (\d+),(\d+) through (\d+),(\d+)/.exec(text);

  return { action, sx: +sx, sy: +sy, ex: +ex, ey: +ey };
};

const input = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(parseInstruction);

// Part 1 code.
const makeGrid = (w, h, init = false) => {
  const grid = new Array(w);

  for (let i = 0; i < w; i++) {
    grid[i] = new Array(h);

    for (let j = 0; j < h; j++) {
      grid[i][j] = init;
    }
  }

  return grid;
};

const apply = ({grid, action, sx, sy, ex, ey}) => {
  for (let x = sx; x <= ex; x++) {
    for (let y = sy; y <= ey; y++) {
      grid[x][y] = action(grid[x][y], x, y, grid);
    }
  }
}

const count = (grid, test) => {
  let count = 0;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      if (test(grid[x][y], x, y, grid)) count++;
    }
  }

  return count;
}

const turnOn = () => true;
const turnOff = () => false;
const toggle = x => !x;
const ACTIONS = {
  'turn on': turnOn,
  'turn off': turnOff,
  'toggle': toggle,
};

const isLit = x => x;

const p1 = () => {
  const grid = makeGrid(1000, 1000);

  input.forEach(({ action, sx, sy, ex, ey }) => apply({
    grid,
    action: ACTIONS[action],
    sx, sy, ex, ey
  }));

  return count(grid, isLit);
};

// Part 2 code.
const reduce = (grid, fn, init = 0) => {
  let agg = init;

  for (let x = 0; x < grid.length; x++) {
    for (let y = 0; y < grid[x].length; y++) {
      agg = fn(agg, grid[x][y], x, y, grid);
    }
  }

  return agg;
}

const newTurnOn = x => x + 1;
const newTurnOff = x => Math.max(0, x - 1);
const newToggle = x => x + 2;
const NEW_ACTIONS = {
  'turn on': newTurnOn,
  'turn off': newTurnOff,
  'toggle': newToggle,
};

const sum = (x, y) => x + y;

const p2 = () => {
  const grid = makeGrid(1000, 1000, 0);

  input.forEach(({ action, sx, sy, ex, ey }) => apply({
    grid,
    action: NEW_ACTIONS[action],
    sx, sy, ex, ey
  }));

  return reduce(grid, sum);
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
