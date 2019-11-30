// Tom Scallon. Advent of Code 2015, day 18.

// Read in input.
const initialState = require('fs')
  .readFileSync(__dirname + '/input.txt', 'utf8')
  .trim().split('\n')
  .map(line => Array.prototype.map.call(line, c => c === '#'));

const countAdjacentOn = (state, i, j) => {
  let count = 0;

  for (let ii = i - 1; ii <= i + 1; ii++) {
    for (let jj = j - 1; jj <= j + 1; jj++) {
      if (ii == i && jj == j) continue;
      if (state[ii] && state[ii][jj]) count++;
    }
  }

  return count;
};

const nextLightState = (state, i, j) => {
  const lit = state[i][j];
  const adj = countAdjacentOn(state, i, j);

  return adj === 3 || lit && adj === 2;
};

const nextState = state => state
  .map((row, i) => row.map((_, j) => nextLightState(state, i, j)));

const countOn = state => state
  .reduce(
    (sum, row) =>
      sum + row.reduce(
        (lit, light) => lit + (light ? 1 : 0),
        0
      ),
    0
  );

const printState = state => state.map(line => line.map(l => l ? '#' : '.').join('')).join('\n');

// Part 1 code.
const p1 = () => {
  let state = initialState;

  for (let i = 0; i < 100; i++) {
    state = nextState(state);
  }

  return countOn(state);
};

// Part 2 code.
const nextLightState2 = (state, i, j) => {
  if (i === 0 && (j === 0 || j === 99) || i === 99 && (j === 0 || j === 99)) {
    return true;
  }

  const lit = state[i][j];
  const adj = countAdjacentOn(state, i, j);

  return adj === 3 || lit && adj === 2;
};

const nextState2 = state => state
  .map((row, i) => row.map((_, j) => nextLightState2(state, i, j)));

const p2 = () => {
  let state = initialState;

  for (let i = 0; i < 100; i++) {
    state = nextState2(state);
  }

  return countOn(state);
};

// Export the functions.
exports[1] = p1;
exports[2] = p2;
